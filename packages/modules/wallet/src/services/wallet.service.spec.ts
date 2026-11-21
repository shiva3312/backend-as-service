import { WalletService } from './wallet.service';
import { prisma } from '@modular-platform/database';
import { InsufficientBalanceException } from '@modular-platform/core';

describe('WalletService Unit Tests', () => {
  let walletService: WalletService;

  beforeEach(() => {
    walletService = new WalletService();
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(walletService).toBeDefined();
  });

  it('should throw InsufficientBalanceException when wallet balance is insufficient', async () => {
    jest.spyOn(prisma.walletTransaction, 'findUnique').mockResolvedValue(null as any);
    jest.spyOn(prisma, '$transaction').mockImplementation(async (cb: any) => {
      const mockTx = {
        wallet: {
          upsert: jest.fn().mockResolvedValue({
            id: 'wallet-1',
            userId: 'user-1',
            appId: 'app-1',
            balanceMinorUnits: 100,
          }),
        },
      };
      return cb(mockTx);
    });

    await expect(
      walletService.deductCredits({
        userId: 'user-1',
        appId: 'app-1',
        amountMinorUnits: 500,
        idempotencyKey: 'tx-key-1',
      }),
    ).rejects.toThrow(InsufficientBalanceException);
  });
});
