export interface PlanDto {
  id: string;
  name: string;
  priceMinorUnits: number;
  currency: string;
  billingCycleDays: number;
  enabledFeatures: string[];
}

export interface SubscriptionDto {
  id: string;
  userId: string;
  appId: string;
  planId: string;
  status: string;
  expiresAt: string;
}

export interface ISubscriptionService {
  getPlans(): Promise<PlanDto[]>;
  subscribeUser(userId: string, appId: string, planId: string): Promise<SubscriptionDto>;
  getUserSubscription(userId: string, appId: string): Promise<SubscriptionDto | null>;
}
