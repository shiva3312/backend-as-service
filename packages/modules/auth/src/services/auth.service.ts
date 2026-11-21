import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { prisma } from '@modular-platform/database';
import * as argon2 from 'argon2';
import * as jwt from 'jsonwebtoken';
import { IAuthService, RegisterDto, LoginDto, AuthTokens } from '../interfaces/auth.service.interface';

@Injectable()
export class AuthService implements IAuthService {
  private readonly jwtAccessSecret = process.env.JWT_ACCESS_SECRET || 'default-access-secret-minimum-32-chars';
  private readonly jwtRefreshSecret = process.env.JWT_REFRESH_SECRET || 'default-refresh-secret-minimum-32-chars';

  async register(dto: RegisterDto): Promise<{ userId: string; email: string }> {
    const existing = await prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });

    if (existing) {
      throw new ConflictException(`User with email '${dto.email}' already exists`);
    }

    const passwordHash = await argon2.hash(dto.password);

    const user = await prisma.user.create({
      data: {
        email: dto.email.toLowerCase(),
        passwordHash,
        firstName: dto.firstName,
        lastName: dto.lastName,
      },
    });

    return {
      userId: user.id,
      email: user.email,
    };
  }

  async login(dto: LoginDto): Promise<AuthTokens> {
    const user = await prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.status === 'BLOCKED' || user.status === 'SUSPENDED') {
      throw new UnauthorizedException('Account is disabled');
    }

    const valid = await argon2.verify(user.passwordHash, dto.password);
    if (!valid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateTokens(user.id, user.email);
  }

  async refreshToken(refreshTokenString: string): Promise<AuthTokens> {
    try {
      const payload = jwt.verify(refreshTokenString, this.jwtRefreshSecret) as { sub: string; email: string };
      const user = await prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user || user.status === 'BLOCKED') {
        throw new UnauthorizedException('Invalid refresh token');
      }

      return this.generateTokens(user.id, user.email);
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  private generateTokens(userId: string, email: string): AuthTokens {
    const accessToken = jwt.sign(
      { sub: userId, email },
      this.jwtAccessSecret,
      { expiresIn: '15m' },
    );

    const refreshToken = jwt.sign(
      { sub: userId, email },
      this.jwtRefreshSecret,
      { expiresIn: '7d' },
    );

    return {
      accessToken,
      refreshToken,
    };
  }
}
