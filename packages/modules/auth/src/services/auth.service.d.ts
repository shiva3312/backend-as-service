import { IAuthService, RegisterDto, LoginDto, AuthTokens } from '../interfaces/auth.service.interface';
export declare class AuthService implements IAuthService {
    private readonly jwtAccessSecret;
    private readonly jwtRefreshSecret;
    register(dto: RegisterDto): Promise<{
        userId: string;
        email: string;
    }>;
    login(dto: LoginDto): Promise<AuthTokens>;
    refreshToken(refreshTokenString: string): Promise<AuthTokens>;
    private generateTokens;
}
