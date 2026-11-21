import { Injectable, ConflictException } from '@nestjs/common';
import { prisma, TransactionType } from '@modular-platform/database';
import { InsufficientBalanceException } from '@modular-platform/core';
import { IWalletService, WalletDto, WalletTransactionDto, CreditDeductionDto } from '../interfaces/wallet.interface';

@Injectable()
export class WalletService implements IWalletService {
  async getWallet(userId: string, appId: string): Promise<WalletDto> {
    const wallet = await prisma.wallet.upsert({
      where: {
        userId_appId: { userId, appId },
      },
      update: {},
      create: {
        userId,
        appId,
        balanceMinorUnits: 0,
        currency: 'CREDITS',
      },
    });

    return {
      id: wallet.id,
      userId: wallet.userId,
      appId: wallet.appId,
      balanceMinorUnits: wallet.balanceMinorUnits,
      currency: wallet.currency,
    };
  }

  async deductCredits(dto: CreditDeductionDto): Promise<WalletTransactionDto> {
    const existingTx = await prisma.walletTransaction.findUnique({
      where: { idempotencyKey: dto.idempotencyKey },
    });

    if (existingTx) {
      return {
        id: existingTx.id,
        walletId: existingTx.walletId,
        type: existingTx.type,
        amountMinorUnits: existingTx.amountMinorUnits,
        balanceAfter: existingTx.balanceAfter,
        idempotencyKey: existingTx.idempotencyKey,
        description: existingTx.description || undefined,
        createdAt: existingTx.createdAt.toISOString(),
      };
    }

    return await prisma.$transaction(async (tx) => {
      const wallet = await tx.wallet.upsert({
        where: {
          userId_appId: { userId: dto.userId, appId: dto.appId },
        },
        update: {},
        create: {
          userId: dto.userId,
          appId: dto.appId,
          balanceMinorUnits: 0,
          currency: 'CREDITS',
        },
      });

      if (wallet.balanceMinorUnits < dto.amountMinorUnits) {
        throw new InsufficientBalanceException(dto.amountMinorUnits, wallet.balanceMinorUnits);
      }

      const updatedWallet = await tx.wallet.update({
        where: { id: wallet.id },
        data: {
          balanceMinorUnits: {
            decrement: dto.amountMinorUnits,
          },
        },
      });

      const transaction = await tx.walletTransaction.create({
        data: {
          walletId: wallet.id,
          type: TransactionType.FEATURE_DEDUCTION,
          amountMinorUnits: dto.amountMinorUnits,
          balanceAfter: updatedWallet.balanceMinorUnits,
          idempotencyKey: dto.idempotencyKey,
          description: dto.description || 'Feature execution credit deduction',
        },
      });

      return {
        id: transaction.id,
        walletId: transaction.walletId,
        type: transaction.type,
        amountMinorUnits: transaction.amountMinorUnits,
        balanceAfter: transaction.balanceAfter,
        idempotencyKey: transaction.idempotencyKey,
        description: transaction.description || undefined,
        createdAt: transaction.createdAt.toISOString(),
      };
    });
  }

  async topupCredits(
    userId: string,
    appId: string,
    amount: number,
    idempotencyKey: string,
  ): Promise<WalletTransactionDto> {
    const existingTx = await prisma.walletTransaction.findUnique({
      where: { idempotencyKey },
    });

    if (existingTx) {
      return {
        id: existingTx.id,
        walletId: existingTx.walletId,
        type: existingTx.type,
        amountMinorUnits: existingTx.amountMinorUnits,
        balanceAfter: existingTx.balanceAfter,
        idempotencyKey: existingTx.idempotencyKey,
        description: existingTx.description || undefined,
        createdAt: existingTx.createdAt.toISOString(),
      };
    }

    return await prisma.$transaction(async (tx) => {
      const wallet = await tx.wallet.upsert({
        where: {
          userId_appId: { userId, appId },
        },
        update: {},
        create: {
          userId,
          appId,
          balanceMinorUnits: 0,
          currency: 'CREDITS',
        },
      });

      const updatedWallet = await tx.wallet.update({
        where: { id: wallet.id },
        data: {
          balanceMinorUnits: {
            increment: amount,
          },
        },
      });

      const transaction = await tx.walletTransaction.create({
        data: {
          walletId: wallet.id,
          type: TransactionType.CREDIT_TOPUP,
          amountMinorUnits: amount,
          balanceAfter: updatedWallet.balanceMinorUnits,
          idempotencyKey,
          description: 'Wallet top-up',
        },
      });

      return {
        id: transaction.id,
        walletId: transaction.walletId,
        type: transaction.type,
        amountMinorUnits: transaction.amountMinorUnits,
        balanceAfter: transaction.balanceAfter,
        idempotencyKey: transaction.idempotencyKey,
        description: transaction.description || undefined,
        createdAt: transaction.createdAt.toISOString(),
      };
    });
  }
}
