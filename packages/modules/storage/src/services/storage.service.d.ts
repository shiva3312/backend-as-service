import { IStorageService, UploadFileDto, FileAssetDto } from '../interfaces/storage.interface';
export declare class StorageService implements IStorageService {
    private readonly provider;
    private readonly masterKekHex;
    upload(appId: string, userId: string, dto: UploadFileDto): Promise<FileAssetDto>;
    getFile(fileId: string, appId: string): Promise<FileAssetDto>;
    deleteFile(fileId: string, appId: string): Promise<void>;
}
