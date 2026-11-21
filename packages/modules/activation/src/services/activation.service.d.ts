import { IActivationService, GenerateKeyDto, ActivationKeyDto } from '../interfaces/activation.interface';
export declare class ActivationService implements IActivationService {
    generateKey(dto: GenerateKeyDto): Promise<ActivationKeyDto>;
    redeemKey(rawKey: string, userId: string, appId: string): Promise<{
        success: boolean;
        grantedCredits: number;
    }>;
}
