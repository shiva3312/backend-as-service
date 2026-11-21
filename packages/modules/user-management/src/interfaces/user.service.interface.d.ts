export interface UserProfileDto {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    roles: string[];
}
export interface IUserService {
    getUserProfile(userId: string, appId: string): Promise<UserProfileDto>;
    updateUserProfile(userId: string, data: Partial<UserProfileDto>): Promise<UserProfileDto>;
}
