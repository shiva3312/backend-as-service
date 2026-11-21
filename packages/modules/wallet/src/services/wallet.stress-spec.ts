import { WalletService } from './wallet.service';
import { prisma } from '@modular-platform/database';

describe('Wallet Concurrency & Stress Tests', () => {
  let walletService: WalletService;

  beforeEach(() => {
    walletService = new WalletService();
    jest.restoreAllMocks();
  });

  it('should handle 20 concurrent credit top-up requests safely', async () => {
    const userId = `stress-user-${Date.now()}`;
    const appId = 'stress-app-1';

    jest.spyOn(prisma.walletTransaction, 'findUnique').mockResolvedValue(null as any);
    jest.spyOn(prisma, '$transaction').mockImplementation(async (cb: any) => {
      const mockTx = {
        wallet: {
          upsert: jest.fn().mockResolvedValue({ id: 'w-1', balanceMinorUnits: 0 }),
          update: jest.fn().mockResolvedValue({ id: 'w-1', balanceMinorUnits: 2000 }),
        },
        walletTransaction: {
          create: jest.fn().mockResolvedValue({
            id: 'tx-stress',
            walletId: 'w-1',
            type: 'CREDIT_TOPUP',
            amountMinorUnits: 100,
            balanceAfter: 2000,
            idempotencyKey: 'key',
            createdAt: new Date(),
          }),
        },
      };
      return cb(mockTx);
    });

    const promises = Array.from({ length: 20 }).map((_, i) =>
      walletService.topupCredits(userId, appId, 100, `stress-topup-key-${i}-${Date.now()}`),
    );

    const results = await Promise.all(promises);
    expect(results.length).toBe(20);
  });
});
