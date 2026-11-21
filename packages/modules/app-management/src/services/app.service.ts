import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { prisma } from '@modular-platform/database';
import * as crypto from 'crypto';
import * as argon2 from 'argon2';
import { IAppManagementService, CreateAppDto, AppConfigDto } from '../interfaces/app.service.interface';

@Injectable()
export class AppManagementService implements IAppManagementService {
  async createApplication(dto: CreateAppDto): Promise<AppConfigDto & { apiKey: string; apiSecret: string }> {
    const existing = await prisma.application.findUnique({
      where: { slug: dto.slug },
    });

    if (existing) {
      throw new ConflictException(`Application with slug '${dto.slug}' already exists`);
    }

    const apiKey = `ak_live_${crypto.randomBytes(16).toString('hex')}`;
    const rawApiSecret = `sk_live_${crypto.randomBytes(24).toString('hex')}`;
    const apiSecretHash = await argon2.hash(rawApiSecret);

    const app = await prisma.application.create({
      data: {
        name: dto.name,
        slug: dto.slug,
        description: dto.description,
        apiKey,
        apiSecretHash,
        allowedOrigins: dto.allowedOrigins || [],
        enabledModules: ['auth', 'user-management', 'storage'],
      },
    });

    return {
      id: app.id,
      name: app.name,
      slug: app.slug,
      status: app.status,
      enabledModules: app.enabledModules,
      apiKey: app.apiKey,
      apiSecret: rawApiSecret,
    };
  }

  async getApplicationById(appId: string): Promise<AppConfigDto> {
    const app = await prisma.application.findUnique({
      where: { id: appId },
    });

    if (!app) {
      throw new NotFoundException(`Application '${appId}' not found`);
    }

    return {
      id: app.id,
      name: app.name,
      slug: app.slug,
      status: app.status,
      enabledModules: app.enabledModules,
    };
  }

  async enableModule(appId: string, moduleId: string): Promise<AppConfigDto> {
    const app = await prisma.application.findUnique({
      where: { id: appId },
    });

    if (!app) {
      throw new NotFoundException(`Application '${appId}' not found`);
    }

    if (app.enabledModules.includes(moduleId)) {
      return {
        id: app.id,
        name: app.name,
        slug: app.slug,
        status: app.status,
        enabledModules: app.enabledModules,
      };
    }

    const updated = await prisma.application.update({
      where: { id: appId },
      data: {
        enabledModules: {
          push: moduleId,
        },
      },
    });

    return {
      id: updated.id,
      name: updated.name,
      slug: updated.slug,
      status: updated.status,
      enabledModules: updated.enabledModules,
    };
  }
}
