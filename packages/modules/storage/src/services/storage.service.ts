import { Injectable, NotFoundException } from '@nestjs/common';
import { prisma, StorageProviderType } from '@modular-platform/database';
import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
import { IStorageService, UploadFileDto, FileAssetDto, StorageProvider } from '../interfaces/storage.interface';

class LocalStorageProvider implements StorageProvider {
  private readonly uploadDir: string;

  constructor() {
    this.uploadDir = process.env.STORAGE_LOCAL_PATH || path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async uploadFile(key: string, buffer: Buffer, mimeType?: string): Promise<string> {
    const filePath = path.join(this.uploadDir, key);
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, buffer);
    return filePath;
  }

  async downloadFile(key: string): Promise<Buffer> {
    const filePath = path.join(this.uploadDir, key);
    if (!fs.existsSync(filePath)) {
      throw new NotFoundException(`File ${key} not found on local storage`);
    }
    return fs.readFileSync(filePath);
  }

  async deleteFile(key: string): Promise<void> {
    const filePath = path.join(this.uploadDir, key);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
}

@Injectable()
export class StorageService implements IStorageService {
  private readonly provider: StorageProvider = new LocalStorageProvider();
  private readonly masterKekHex =
    process.env.MASTER_ENCRYPTION_KEY || '000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f';

  async upload(appId: string, userId: string, dto: UploadFileDto): Promise<FileAssetDto> {
    const storageKey = `${appId}/${userId}/${Date.now()}-${dto.filename}`;
    let finalBuffer = dto.buffer;
    let encryptionData: { encryptedDek: string; ivHex: string; authTagHex: string } | null = null;

    if (dto.encrypt) {
      const dek = crypto.randomBytes(32);
      const iv = crypto.randomBytes(12);

      const cipher = crypto.createCipheriv('aes-256-gcm', dek, iv);
      const encryptedPayload = Buffer.concat([cipher.update(dto.buffer), cipher.final()]);
      const authTag = cipher.getAuthTag();

      finalBuffer = encryptedPayload;

      // Wrap DEK with Master KEK
      const kek = Buffer.from(this.masterKekHex, 'hex');
      const kekIv = crypto.randomBytes(12);
      const kekCipher = crypto.createCipheriv('aes-256-gcm', kek, kekIv);
      const encryptedDekBuffer = Buffer.concat([kekCipher.update(dek), kekCipher.final()]);
      const kekAuthTag = kekCipher.getAuthTag();

      // Store wrapped DEK payload: kekIv (12 bytes) + kekAuthTag (16 bytes) + encryptedDek
      const wrappedDekPayload = Buffer.concat([kekIv, kekAuthTag, encryptedDekBuffer]).toString('hex');

      encryptionData = {
        encryptedDek: wrappedDekPayload,
        ivHex: iv.toString('hex'),
        authTagHex: authTag.toString('hex'),
      };
    }

    await this.provider.uploadFile(storageKey, finalBuffer, dto.mimeType);

    const fileRecord = await prisma.fileAsset.create({
      data: {
        appId,
        userId,
        filename: dto.filename,
        originalName: dto.originalName,
        mimeType: dto.mimeType,
        sizeBytes: BigInt(dto.buffer.length),
        storageProvider: StorageProviderType.LOCAL,
        storageKey,
        isEncrypted: dto.encrypt,
        ...(encryptionData && {
          encryptionMetadata: {
            create: {
              algorithm: 'AES-256-GCM',
              encryptedDek: encryptionData.encryptedDek,
              ivHex: encryptionData.ivHex,
              authTagHex: encryptionData.authTagHex,
            },
          },
        }),
      },
    });

    return {
      id: fileRecord.id,
      filename: fileRecord.filename,
      mimeType: fileRecord.mimeType,
      sizeBytes: Number(fileRecord.sizeBytes),
      isEncrypted: fileRecord.isEncrypted,
      deletedAt: null,
      downloadUrl: `/v1/files/${fileRecord.id}`,
    };
  }

  async getFile(fileId: string, appId: string): Promise<FileAssetDto> {
    // Only return file if deletedAt is null (not soft deleted)
    const file = await prisma.fileAsset.findFirst({
      where: { id: fileId, appId, deletedAt: null },
      include: { encryptionMetadata: true },
    });

    if (!file) {
      throw new NotFoundException(`File '${fileId}' not found`);
    }

    return {
      id: file.id,
      filename: file.filename,
      mimeType: file.mimeType,
      sizeBytes: Number(file.sizeBytes),
      isEncrypted: file.isEncrypted,
      deletedAt: file.deletedAt ? file.deletedAt.toISOString() : null,
      downloadUrl: `/v1/files/${file.id}`,
    };
  }

  async deleteFile(fileId: string, appId: string): Promise<void> {
    const file = await prisma.fileAsset.findFirst({
      where: { id: fileId, appId, deletedAt: null },
    });

    if (!file) {
      throw new NotFoundException(`File '${fileId}' not found`);
    }

    // Soft delete: update deletedAt timestamp in database
    // The physical asset is preserved on the storage provider for data safety
    await prisma.fileAsset.update({
      where: { id: fileId },
      data: { deletedAt: new Date() },
    });
  }

  async restoreFile(fileId: string, appId: string): Promise<FileAssetDto> {
    const file = await prisma.fileAsset.findFirst({
      where: { id: fileId, appId, deletedAt: { not: null } },
    });

    if (!file) {
      throw new NotFoundException(`Soft-deleted file '${fileId}' not found`);
    }

    const restored = await prisma.fileAsset.update({
      where: { id: fileId },
      data: { deletedAt: null },
    });

    return {
      id: restored.id,
      filename: restored.filename,
      mimeType: restored.mimeType,
      sizeBytes: Number(restored.sizeBytes),
      isEncrypted: restored.isEncrypted,
      deletedAt: null,
      downloadUrl: `/v1/files/${restored.id}`,
    };
  }
}
