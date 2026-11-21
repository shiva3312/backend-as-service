export interface CreateAppDto {
  name: string;
  slug: string;
  description?: string;
  allowedOrigins?: string[];
}

export interface AppConfigDto {
  id: string;
  name: string;
  slug: string;
  status: string;
  enabledModules: string[];
}

export interface IAppManagementService {
  createApplication(dto: CreateAppDto): Promise<AppConfigDto>;
  getApplicationById(appId: string): Promise<AppConfigDto>;
  enableModule(appId: string, moduleId: string): Promise<AppConfigDto>;
}
