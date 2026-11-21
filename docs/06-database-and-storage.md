# 06. Database & Storage Architecture

## Database Design (PostgreSQL + Prisma)

Key tables and relationships:
- `Application`: Owns tenant configurations, enabled modules, and credentials.
- `User`: Global user entity bound to applications via `UserAppRole`.
- `SubscriptionPlan` & `UserSubscription`: Active subscriptions and recurring entitlements.
- `Wallet` & `WalletTransaction`: Financial credit balances and immutable audit entries.
- `ActivationKey` & `KeyRedemption`: License key generation and redemption history.
- `FileAsset` & `EncryptionMetadata`: File storage pointers, storage provider type, and AES-256-GCM DEK wraps.

## Abstract Storage Provider Interface

```typescript
export interface StorageProvider {
  uploadFile(key: string, buffer: Buffer, mimeType: string): Promise<StorageObject>;
  downloadFile(key: string): Promise<Buffer>;
  getSignedUrl(key: string, expiresInSeconds: number): Promise<string>;
  deleteFile(key: string): Promise<void>;
}
```

Implementations:
- `LocalStorageProvider`: Local filesystem for dev/testing.
- `S3StorageProvider`: AWS S3 or MinIO.
- `CloudflareR2StorageProvider`: High-throughput, zero-egress cloud storage.
