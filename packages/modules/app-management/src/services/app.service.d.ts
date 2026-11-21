import { IAppManagementService, CreateAppDto, AppConfigDto } from '../interfaces/app.service.interface';
export declare class AppManagementService implements IAppManagementService {
    createApplication(dto: CreateAppDto): Promise<AppConfigDto & {
        apiKey: string;
        apiSecret: string;
    }>;
    getApplicationById(appId: string): Promise<AppConfigDto>;
    enableModule(appId: string, moduleId: string): Promise<AppConfigDto>;
}
