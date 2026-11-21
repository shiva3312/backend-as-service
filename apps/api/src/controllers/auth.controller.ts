import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse as SwaggerResponse } from '@nestjs/swagger';
import { AuthService, RegisterDto, LoginDto, AuthTokens } from '@modular-platform/module-auth';
import { createSuccessResponse, ApiResponse } from '@modular-platform/shared';

@ApiTags('Authentication & Identity')
@Controller('v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user identity' })
  @SwaggerResponse({ status: 201, description: 'User successfully registered' })
  async register(@Body() body: RegisterDto): Promise<ApiResponse<{ userId: string; email: string }>> {
    const result = await this.authService.register(body);
    return createSuccessResponse(result);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Authenticate user and issue access & refresh tokens' })
  @SwaggerResponse({ status: 200, description: 'Authentication successful' })
  async login(@Body() body: LoginDto): Promise<ApiResponse<AuthTokens>> {
    const tokens = await this.authService.login(body);
    return createSuccessResponse(tokens);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Rotate refresh token and issue new access token' })
  @SwaggerResponse({ status: 200, description: 'Token refreshed successfully' })
  async refreshToken(@Body('refreshToken') refreshToken: string): Promise<ApiResponse<AuthTokens>> {
    const tokens = await this.authService.refreshToken(refreshToken);
    return createSuccessResponse(tokens);
  }
}
