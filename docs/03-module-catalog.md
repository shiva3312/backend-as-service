# 03. Core Module Catalog

The platform consists of 10 primary feature modules:

| Module Name | Package Path | Responsibility | Public Interface |
|---|---|---|---|
| **Authentication & Identity** | `packages/modules/auth` | User registration, login, JWT issuance, refresh rotation, password reset, 2FA | `IAuthService` |
| **User & Org Management** | `packages/modules/user-management` | User profiles, organization hierarchy, multi-device management | `IUserService` |
| **Application Management** | `packages/modules/app-management` | Application CRUD, tenant isolation, app-level settings, module enablement | `IAppManagementService` |
| **Module Registry** | `packages/core` | Dynamic module registration, dependency declaration, feature flag resolution | `IModuleRegistry` |
| **Feature Access Engine** | `packages/core` | Entitlement resolution, access policy checks, quota validation | `IFeatureAccessEngine` |
| **Storage & Upload** | `packages/modules/storage` | File upload, chunking, storage provider delegation, envelope encryption | `IStorageService` |
| **Subscription Management** | `packages/modules/billing` | Subscription plans, billing cycles, trial management, auto-renewals | `ISubscriptionService` |
| **Wallet & Credit Ledger** | `packages/modules/wallet` | Immutable ledger, atomic balance updates, credit top-up, idempotency | `IWalletService` |
| **Activation & License Keys**| `packages/modules/activation` | License key generation, hash validation, redemption, entitlement binding | `IActivationService` |
| **Notification & Audit** | `packages/core` | Email/Webhook delivery, background workers, security audit logging | `IAuditLoggerService` |
