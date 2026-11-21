import { WalletService } from './wallet.service';
import { prisma } from '@modular-platform/database';

describe('Wallet Integration & Workflow Tests', () => {
  let walletService: WalletService;

  beforeEach(() => {
    walletService = new WalletService();
    jest.restoreAllMocks();
  });

  it('should process top-up and credit deduction workflow correctly', async () => {
    const userId = 'int-user-1';
    const appId = 'int-app-1';
    const idempotencyTopup = `topup-${Date.now()}`;
    const idempotencyDeduct = `deduct-${Date.now()}`;

    // Mock TopUp
    jest.spyOn(prisma.walletTransaction, 'findUnique').mockResolvedValue(null as any);
    jest.spyOn(prisma, '$transaction').mockImplementation(async (cb: any) => {
      const mockTx = {
        wallet: {
          upsert: jest.fn().mockResolvedValue({ id: 'w-1', balanceMinorUnits: 0 }),
          update: jest.fn().mockResolvedValue({ id: 'w-1', balanceMinorUnits: 1000 }),
        },
        walletTransaction: {
          create: jest.fn().mockResolvedValue({
            id: 'tx-1',
            walletId: 'w-1',
            type: 'CREDIT_TOPUP',
            amountMinorUnits: 1000,
            balanceAfter: 1000,
            idempotencyKey: idempotencyTopup,
            createdAt: new Date(),
          }),
        },
      };
      return cb(mockTx);
    });

    const topupTx = await walletService.topupCredits(userId, appId, 1000, idempotencyTopup);
    expect(topupTx.balanceAfter).toEqual(1000);

    // Mock Deduct
    jest.spyOn(prisma, '$transaction').mockImplementation(async (cb: any) => {
      const mockTx = {
        wallet: {
          upsert: jest.fn().mockResolvedValue({ id: 'w-1', balanceMinorUnits: 1000 }),
          update: jest.fn().mockResolvedValue({ id: 'w-1', balanceMinorUnits: 700 }),
        },
        walletTransaction: {
          create: jest.fn().mockResolvedValue({
            id: 'tx-2',
            walletId: 'w-1',
            type: 'FEATURE_DEDUCTION',
            amountMinorUnits: 300,
            balanceAfter: 700,
            idempotencyKey: idempotencyDeduct,
            createdAt: new Date(),
          }),
        },
      };
      return cb(mockTx);
    });

    const deductTx = await walletService.deductCredits({
      userId,
      appId,
      amountMinorUnits: 300,
      idempotencyKey: idempotencyDeduct,
    });
    expect(deductTx.amountMinorUnits).toBe(300);

    // Mock Idempotency duplicate return
    jest.spyOn(prisma.walletTransaction, 'findUnique').mockResolvedValue({
      id: 'tx-2',
      walletId: 'w-1',
      type: 'FEATURE_DEDUCTION',
      amountMinorUnits: 300,
      balanceAfter: 700,
      idempotencyKey: idempotencyDeduct,
      createdAt: new Date(),
    } as any);

    const duplicateTx = await walletService.deductCredits({
      userId,
      appId,
      amountMinorUnits: 300,
      idempotencyKey: idempotencyDeduct,
    });
    expect(duplicateTx.id).toBe(deductTx.id);
  });
});
