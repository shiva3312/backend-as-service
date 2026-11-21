import { ISubscriptionService, PlanDto, SubscriptionDto } from '../interfaces/billing.interface';
export declare class SubscriptionService implements ISubscriptionService {
    getPlans(): Promise<PlanDto[]>;
    subscribeUser(userId: string, appId: string, planId: string): Promise<SubscriptionDto>;
    getUserSubscription(userId: string, appId: string): Promise<SubscriptionDto | null>;
}
