import { Controller, Get, Post, Delete, Body, Param, Headers, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiHeader, ApiResponse as SwaggerResponse } from '@nestjs/swagger';
import { StorageService, UploadFileDto, FileAssetDto } from '@modular-platform/module-storage';
import { TenantGuard } from '@modular-platform/core';
import { createSuccessResponse, ApiResponse } from '@modular-platform/shared';

@ApiTags('Data Upload & Storage')
@Controller('v1/files')
@UseGuards(TenantGuard)
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Post('upload')
  @ApiOperation({ summary: 'Upload file asset with optional envelope encryption' })
  @ApiHeader({ name: 'x-app-id', required: true, description: 'Application Tenant ID' })
  @SwaggerResponse({ status: 201, description: 'File uploaded and metadata recorded' })
  async uploadFile(
    @Headers('x-app-id') appId: string,
    @Body() body: UploadFileDto,
  ): Promise<ApiResponse<FileAssetDto>> {
    const fileAsset = await this.storageService.upload(appId, 'mock-user-id', body);
    return createSuccessResponse(fileAsset);
  }

  @Get(':fileId')
  @ApiOperation({ summary: 'Retrieve file metadata and download credentials' })
  @ApiHeader({ name: 'x-app-id', required: true, description: 'Application Tenant ID' })
  @SwaggerResponse({ status: 200, description: 'File metadata returned' })
  async getFile(
    @Headers('x-app-id') appId: string,
    @Param('fileId') fileId: string,
  ): Promise<ApiResponse<FileAssetDto>> {
    const fileAsset = await this.storageService.getFile(fileId, appId);
    return createSuccessResponse(fileAsset);
  }

  @Delete(':fileId')
  @ApiOperation({ summary: 'Soft delete file asset' })
  @ApiHeader({ name: 'x-app-id', required: true, description: 'Application Tenant ID' })
  @SwaggerResponse({ status: 200, description: 'File asset soft-deleted' })
  async deleteFile(
    @Headers('x-app-id') appId: string,
    @Param('fileId') fileId: string,
  ): Promise<ApiResponse<{ softDeleted: boolean }>> {
    await this.storageService.deleteFile(fileId, appId);
    return createSuccessResponse({ softDeleted: true });
  }

  @Post(':fileId/restore')
  @ApiOperation({ summary: 'Restore a soft-deleted file asset' })
  @ApiHeader({ name: 'x-app-id', required: true, description: 'Application Tenant ID' })
  @SwaggerResponse({ status: 200, description: 'File asset restored' })
  async restoreFile(
    @Headers('x-app-id') appId: string,
    @Param('fileId') fileId: string,
  ): Promise<ApiResponse<FileAssetDto>> {
    const fileAsset = await this.storageService.restoreFile(fileId, appId);
    return createSuccessResponse(fileAsset);
  }
}
