export interface GenerateKeyDto {
  appId: string;
  prefix?: string;
  maxActivations?: number;
  grantCredits?: number;
  grantPlanId?: string;
}

export interface ActivationKeyDto {
  id: string;
  keyString?: string;
  keyPrefix: string;
  maxActivations: number;
  usedActivations: number;
  grantCredits: number;
}

export interface IActivationService {
  generateKey(dto: GenerateKeyDto): Promise<ActivationKeyDto>;
  redeemKey(rawKey: string, userId: string, appId: string): Promise<{ success: boolean; grantedCredits: number }>;
}
