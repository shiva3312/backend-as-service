import { IUserService, UserProfileDto } from '../interfaces/user.service.interface';
export declare class UserService implements IUserService {
    getUserProfile(userId: string, appId: string): Promise<UserProfileDto>;
    updateUserProfile(userId: string, data: Partial<UserProfileDto>): Promise<UserProfileDto>;
}
