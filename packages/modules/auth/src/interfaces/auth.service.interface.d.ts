export interface RegisterDto {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
}
export interface LoginDto {
    email: string;
    password: string;
}
export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}
export interface IAuthService {
    register(dto: RegisterDto): Promise<{
        userId: string;
        email: string;
    }>;
    login(dto: LoginDto): Promise<AuthTokens>;
    refreshToken(token: string): Promise<AuthTokens>;
}
