import { Controller, Post, Body, Headers, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiHeader, ApiResponse as SwaggerResponse } from '@nestjs/swagger';
import { ActivationService, GenerateKeyDto, ActivationKeyDto } from '@modular-platform/module-activation';
import { TenantGuard } from '@modular-platform/core';
import { createSuccessResponse, ApiResponse } from '@modular-platform/shared';

@ApiTags('Activation & License Keys')
@Controller('v1/activation')
export class ActivationController {
  constructor(private readonly activationService: ActivationService) {}

  @Post('generate')
  @ApiOperation({ summary: 'Generate a new license key bound to an application' })
  @SwaggerResponse({ status: 201, description: 'Activation key generated' })
  async generateKey(@Body() body: GenerateKeyDto): Promise<ApiResponse<ActivationKeyDto>> {
    const key = await this.activationService.generateKey(body);
    return createSuccessResponse(key);
  }

  @Post('redeem')
  @UseGuards(TenantGuard)
  @ApiOperation({ summary: 'Redeem an activation key to grant feature/credit entitlements' })
  @ApiHeader({ name: 'x-app-id', required: true, description: 'Application Tenant ID' })
  @SwaggerResponse({ status: 200, description: 'Activation key redeemed' })
  async redeemKey(
    @Headers('x-app-id') appId: string,
    @Body('key') rawKey: string,
  ): Promise<ApiResponse<{ success: boolean; grantedCredits: number }>> {
    const result = await this.activationService.redeemKey(rawKey, 'mock-user-id', appId);
    return createSuccessResponse(result);
  }
}
