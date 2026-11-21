import { IWalletService, WalletDto, WalletTransactionDto, CreditDeductionDto } from '../interfaces/wallet.interface';
export declare class WalletService implements IWalletService {
    getWallet(userId: string, appId: string): Promise<WalletDto>;
    deductCredits(dto: CreditDeductionDto): Promise<WalletTransactionDto>;
    topupCredits(userId: string, appId: string, amount: number, idempotencyKey: string): Promise<WalletTransactionDto>;
}
