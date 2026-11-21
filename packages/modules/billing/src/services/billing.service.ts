import { Injectable, NotFoundException } from '@nestjs/common';
import { prisma, SubscriptionStatus } from '@modular-platform/database';
import { ISubscriptionService, PlanDto, SubscriptionDto } from '../interfaces/billing.interface';

@Injectable()
export class SubscriptionService implements ISubscriptionService {
  async getPlans(): Promise<PlanDto[]> {
    const plans = await prisma.subscriptionPlan.findMany({
      where: { isActive: true },
    });

    return plans.map((p) => ({
      id: p.id,
      name: p.name,
      priceMinorUnits: p.priceMinorUnits,
      currency: p.currency,
      billingCycleDays: p.billingCycleDays,
      enabledFeatures: p.enabledFeatures,
    }));
  }

  async subscribeUser(userId: string, appId: string, planId: string): Promise<SubscriptionDto> {
    const plan = await prisma.subscriptionPlan.findUnique({
      where: { id: planId },
    });

    if (!plan) {
      throw new NotFoundException(`Subscription plan '${planId}' not found`);
    }

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + plan.billingCycleDays);

    const subscription = await prisma.userSubscription.create({
      data: {
        userId,
        appId,
        planId,
        status: SubscriptionStatus.ACTIVE,
        expiresAt,
      },
    });

    return {
      id: subscription.id,
      userId: subscription.userId,
      appId: subscription.appId,
      planId: subscription.planId,
      status: subscription.status,
      expiresAt: subscription.expiresAt.toISOString(),
    };
  }

  async getUserSubscription(userId: string, appId: string): Promise<SubscriptionDto | null> {
    const subscription = await prisma.userSubscription.findFirst({
      where: {
        userId,
        appId,
        status: SubscriptionStatus.ACTIVE,
        expiresAt: {
          gt: new Date(),
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (!subscription) {
      return null;
    }

    return {
      id: subscription.id,
      userId: subscription.userId,
      appId: subscription.appId,
      planId: subscription.planId,
      status: subscription.status,
      expiresAt: subscription.expiresAt.toISOString(),
    };
  }
}
