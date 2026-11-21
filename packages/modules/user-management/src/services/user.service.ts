import { Injectable, NotFoundException } from '@nestjs/common';
import { prisma } from '@modular-platform/database';
import { IUserService, UserProfileDto } from '../interfaces/user.service.interface';

@Injectable()
export class UserService implements IUserService {
  async getUserProfile(userId: string, appId: string): Promise<UserProfileDto> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        userAppRoles: {
          where: { appId },
        },
      },
    });

    if (!user) {
      throw new NotFoundException(`User '${userId}' not found`);
    }

    const roles = user.userAppRoles.map((r) => r.role);
    if (roles.length === 0) {
      roles.push('USER');
    }

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName || undefined,
      lastName: user.lastName || undefined,
      roles,
    };
  }

  async updateUserProfile(userId: string, data: Partial<UserProfileDto>): Promise<UserProfileDto> {
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
      },
    });

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName || undefined,
      lastName: user.lastName || undefined,
      roles: data.roles || ['USER'],
    };
  }
}
