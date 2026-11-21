export interface UploadFileDto {
  filename: string;
  originalName: string;
  mimeType: string;
  buffer: Buffer;
  encrypt: boolean;
}

export interface FileAssetDto {
  id: string;
  filename: string;
  mimeType: string;
  sizeBytes: number;
  isEncrypted: boolean;
  deletedAt?: string | null;
  downloadUrl?: string;
}

export interface StorageProvider {
  uploadFile(key: string, buffer: Buffer, mimeType?: string): Promise<string>;
  downloadFile(key: string): Promise<Buffer>;
  deleteFile(key: string): Promise<void>;
}

export interface IStorageService {
  upload(appId: string, userId: string, dto: UploadFileDto): Promise<FileAssetDto>;
  getFile(fileId: string, appId: string): Promise<FileAssetDto>;
  deleteFile(fileId: string, appId: string): Promise<void>;
  restoreFile(fileId: string, appId: string): Promise<FileAssetDto>;
}
