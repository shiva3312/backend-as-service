import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { prisma, TransactionType } from '@modular-platform/database';
import * as crypto from 'crypto';
import { IActivationService, GenerateKeyDto, ActivationKeyDto } from '../interfaces/activation.interface';

@Injectable()
export class ActivationService implements IActivationService {
  async generateKey(dto: GenerateKeyDto): Promise<ActivationKeyDto> {
    const prefix = (dto.prefix || 'APP').toUpperCase();
    const randomSegment1 = crypto.randomBytes(2).toString('hex').toUpperCase();
    const randomSegment2 = crypto.randomBytes(2).toString('hex').toUpperCase();
    const randomSegment3 = crypto.randomBytes(2).toString('hex').toUpperCase();

    const rawKey = `${prefix}-${randomSegment1}-${randomSegment2}-${randomSegment3}`;
    const keyHash = crypto.createHash('sha256').update(rawKey).digest('hex');

    const keyRecord = await prisma.activationKey.create({
      data: {
        appId: dto.appId,
        keyPrefix: prefix,
        keyHash,
        maxActivations: dto.maxActivations || 1,
        grantCredits: dto.grantCredits || 0,
        grantPlanId: dto.grantPlanId,
      },
    });

    return {
      id: keyRecord.id,
      keyString: rawKey,
      keyPrefix: keyRecord.keyPrefix,
      maxActivations: keyRecord.maxActivations,
      usedActivations: keyRecord.usedActivations,
      grantCredits: keyRecord.grantCredits,
    };
  }

  async redeemKey(rawKey: string, userId: string, appId: string): Promise<{ success: boolean; grantedCredits: number }> {
    const keyHash = crypto.createHash('sha256').update(rawKey.trim()).digest('hex');

    const keyRecord = await prisma.activationKey.findUnique({
      where: { keyHash },
    });

    if (!keyRecord || keyRecord.appId !== appId || !keyRecord.isActive) {
      throw new NotFoundException('Invalid or inactive activation key');
    }

    if (keyRecord.usedActivations >= keyRecord.maxActivations) {
      throw new BadRequestException('Activation key maximum redemptions reached');
    }

    if (keyRecord.expiresAt && keyRecord.expiresAt < new Date()) {
      throw new BadRequestException('Activation key has expired');
    }

    await prisma.$transaction(async (tx) => {
      await tx.activationKey.update({
        where: { id: keyRecord.id },
        data: {
          usedActivations: { increment: 1 },
        },
      });

      await tx.keyRedemption.create({
        data: {
          keyId: keyRecord.id,
          userId,
        },
      });

      if (keyRecord.grantCredits > 0) {
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
              increment: keyRecord.grantCredits,
            },
          },
        });

        await tx.walletTransaction.create({
          data: {
            walletId: wallet.id,
            type: TransactionType.PROMOTIONAL_CREDIT,
            amountMinorUnits: keyRecord.grantCredits,
            balanceAfter: updatedWallet.balanceMinorUnits,
            idempotencyKey: `redemption-${keyRecord.id}-${userId}-${Date.now()}`,
            description: `Activation key redemption (${keyRecord.keyPrefix})`,
          },
        });
      }
    });

    return {
      success: true,
      grantedCredits: keyRecord.grantCredits,
    };
  }
}
