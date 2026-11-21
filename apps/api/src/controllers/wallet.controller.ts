import { Controller, Get, Post, Body, Headers, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiHeader, ApiResponse as SwaggerResponse } from '@nestjs/swagger';
import { WalletService, CreditDeductionDto, WalletDto, WalletTransactionDto } from '@modular-platform/module-wallet';
import { TenantGuard } from '@modular-platform/core';
import { createSuccessResponse, ApiResponse } from '@modular-platform/shared';

@ApiTags('Wallet & Credit Ledger')
@Controller('v1/wallet')
@UseGuards(TenantGuard)
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Get()
  @ApiOperation({ summary: 'Get current user wallet balance' })
  @ApiHeader({ name: 'x-app-id', required: true, description: 'Application Tenant ID' })
  @SwaggerResponse({ status: 200, description: 'Wallet balance object' })
  async getWallet(@Headers('x-app-id') appId: string): Promise<ApiResponse<WalletDto>> {
    const wallet = await this.walletService.getWallet('mock-user-id', appId);
    return createSuccessResponse(wallet);
  }

  @Post('deduct')
  @ApiOperation({ summary: 'Deduct credits from wallet idempotently' })
  @ApiHeader({ name: 'x-app-id', required: true, description: 'Application Tenant ID' })
  @SwaggerResponse({ status: 200, description: 'Transaction record for deduction' })
  async deductCredits(
    @Headers('x-app-id') appId: string,
    @Body() body: Omit<CreditDeductionDto, 'appId' | 'userId'>,
  ): Promise<ApiResponse<WalletTransactionDto>> {
    const result = await this.walletService.deductCredits({
      ...body,
      appId,
      userId: 'mock-user-id',
    });
    return createSuccessResponse(result);
  }

  @Post('topup')
  @ApiOperation({ summary: 'Top-up wallet credits idempotently' })
  @ApiHeader({ name: 'x-app-id', required: true, description: 'Application Tenant ID' })
  @SwaggerResponse({ status: 200, description: 'Transaction record for top-up' })
  async topupCredits(
    @Headers('x-app-id') appId: string,
    @Body('amount') amount: number,
    @Body('idempotencyKey') idempotencyKey: string,
  ): Promise<ApiResponse<WalletTransactionDto>> {
    const result = await this.walletService.topupCredits('mock-user-id', appId, amount, idempotencyKey);
    return createSuccessResponse(result);
  }
}
