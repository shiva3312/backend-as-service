import { Controller, Get, Post, Body, Headers, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiHeader, ApiResponse as SwaggerResponse } from '@nestjs/swagger';
import { SubscriptionService, PlanDto, SubscriptionDto } from '@modular-platform/module-billing';
import { TenantGuard } from '@modular-platform/core';
import { createSuccessResponse, ApiResponse } from '@modular-platform/shared';

@ApiTags('Subscription & Monetization')
@Controller('v1/subscriptions')
export class BillingController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Get('plans')
  @ApiOperation({ summary: 'List all active subscription plans' })
  @SwaggerResponse({ status: 200, description: 'Available subscription plans' })
  async getPlans(): Promise<ApiResponse<PlanDto[]>> {
    const plans = await this.subscriptionService.getPlans();
    return createSuccessResponse(plans);
  }

  @Post('subscribe')
  @UseGuards(TenantGuard)
  @ApiOperation({ summary: 'Subscribe current user to a plan' })
  @ApiHeader({ name: 'x-app-id', required: true, description: 'Application Tenant ID' })
  @SwaggerResponse({ status: 201, description: 'Subscription successfully created' })
  async subscribe(
    @Headers('x-app-id') appId: string,
    @Body('planId') planId: string,
  ): Promise<ApiResponse<SubscriptionDto>> {
    const subscription = await this.subscriptionService.subscribeUser('mock-user-id', appId, planId);
    return createSuccessResponse(subscription);
  }

  @Get('me')
  @UseGuards(TenantGuard)
  @ApiOperation({ summary: 'Get current user active subscription' })
  @ApiHeader({ name: 'x-app-id', required: true, description: 'Application Tenant ID' })
  @SwaggerResponse({ status: 200, description: 'User subscription status' })
  async getUserSubscription(
    @Headers('x-app-id') appId: string,
  ): Promise<ApiResponse<SubscriptionDto | null>> {
    const sub = await this.subscriptionService.getUserSubscription('mock-user-id', appId);
    return createSuccessResponse(sub);
  }
}
