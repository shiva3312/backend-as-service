export interface WalletDto {
    id: string;
    userId: string;
    appId: string;
    balanceMinorUnits: number;
    currency: string;
}
export interface WalletTransactionDto {
    id: string;
    walletId: string;
    type: string;
    amountMinorUnits: number;
    balanceAfter: number;
    idempotencyKey: string;
    description?: string;
    createdAt: string;
}
export interface CreditDeductionDto {
    userId: string;
    appId: string;
    amountMinorUnits: number;
    idempotencyKey: string;
    description?: string;
}
export interface IWalletService {
    getWallet(userId: string, appId: string): Promise<WalletDto>;
    deductCredits(dto: CreditDeductionDto): Promise<WalletTransactionDto>;
    topupCredits(userId: string, appId: string, amount: number, idempotencyKey: string): Promise<WalletTransactionDto>;
}
