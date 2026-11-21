import { Module } from '@nestjs/common';
import { AuthService } from '@modular-platform/module-auth';
import { UserService } from '@modular-platform/module-user-management';
import { AppManagementService } from '@modular-platform/module-app-management';
import { StorageService } from '@modular-platform/module-storage';
import { SubscriptionService } from '@modular-platform/module-billing';
import { WalletService } from '@modular-platform/module-wallet';
import { ActivationService } from '@modular-platform/module-activation';
import { ModuleRegistry, TenantGuard } from '@modular-platform/core';

import { AuthController } from './controllers/auth.controller';
import { UserController } from './controllers/user.controller';
import { AppManagementController } from './controllers/app.controller';
import { StorageController } from './controllers/storage.controller';
import { BillingController } from './controllers/billing.controller';
import { WalletController } from './controllers/wallet.controller';
import { ActivationController } from './controllers/activation.controller';

@Module({
  imports: [],
  controllers: [
    AuthController,
    UserController,
    AppManagementController,
    StorageController,
    BillingController,
    WalletController,
    ActivationController,
  ],
  providers: [
    AuthService,
    UserService,
    AppManagementService,
    StorageService,
    SubscriptionService,
    WalletService,
    ActivationService,
    ModuleRegistry,
    TenantGuard,
  ],
})
export class AppModule {}
