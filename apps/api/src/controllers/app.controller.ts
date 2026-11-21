import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse as SwaggerResponse } from '@nestjs/swagger';
import { AppManagementService, CreateAppDto, AppConfigDto } from '@modular-platform/module-app-management';
import { createSuccessResponse, ApiResponse } from '@modular-platform/shared';

@ApiTags('Application Management')
@Controller('v1/apps')
export class AppManagementController {
  constructor(private readonly appService: AppManagementService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new multi-tenant application configuration' })
  @SwaggerResponse({ status: 201, description: 'Application created successfully' })
  async createApp(@Body() body: CreateAppDto): Promise<ApiResponse<AppConfigDto>> {
    const app = await this.appService.createApplication(body);
    return createSuccessResponse(app);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get application details and enabled module list' })
  @SwaggerResponse({ status: 200, description: 'Application details returned' })
  async getApp(@Param('id') appId: string): Promise<ApiResponse<AppConfigDto>> {
    const app = await this.appService.getApplicationById(appId);
    return createSuccessResponse(app);
  }

  @Post(':id/modules/:moduleId/enable')
  @ApiOperation({ summary: 'Enable a platform feature module for an application' })
  @SwaggerResponse({ status: 200, description: 'Module enabled successfully' })
  async enableModule(
    @Param('id') appId: string,
    @Param('moduleId') moduleId: string,
  ): Promise<ApiResponse<AppConfigDto>> {
    const app = await this.appService.enableModule(appId, moduleId);
    return createSuccessResponse(app);
  }
}
