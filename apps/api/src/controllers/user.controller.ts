import { Controller, Get, Patch, Body, Headers, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiHeader, ApiResponse as SwaggerResponse } from '@nestjs/swagger';
import { UserService, UserProfileDto } from '@modular-platform/module-user-management';
import { TenantGuard } from '@modular-platform/core';
import { createSuccessResponse, ApiResponse } from '@modular-platform/shared';

@ApiTags('User & Profile Management')
@Controller('v1/users')
@UseGuards(TenantGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile within application context' })
  @ApiHeader({ name: 'x-app-id', required: true, description: 'Application Tenant ID' })
  @SwaggerResponse({ status: 200, description: 'User profile details returned' })
  async getProfile(@Headers('x-app-id') appId: string): Promise<ApiResponse<UserProfileDto>> {
    const profile = await this.userService.getUserProfile('mock-user-id', appId);
    return createSuccessResponse(profile);
  }

  @Patch('me')
  @ApiOperation({ summary: 'Update user profile attributes' })
  @ApiHeader({ name: 'x-app-id', required: true, description: 'Application Tenant ID' })
  @SwaggerResponse({ status: 200, description: 'User profile updated' })
  async updateProfile(
    @Headers('x-app-id') appId: string,
    @Body() body: Partial<UserProfileDto>,
  ): Promise<ApiResponse<UserProfileDto>> {
    const updated = await this.userService.updateUserProfile('mock-user-id', body);
    return createSuccessResponse(updated);
  }
}
