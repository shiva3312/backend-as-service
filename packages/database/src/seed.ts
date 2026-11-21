import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // 1. Create Default Application
  const apiKey = 'ak_live_default_demo_application_key';
  const apiSecretHash = await argon2.hash('sk_live_default_demo_application_secret');

  const app = await prisma.application.upsert({
    where: { slug: 'demo-app' },
    update: {},
    create: {
      name: 'Demo Application',
      slug: 'demo-app',
      description: 'Default BaaS demo application tenant',
      apiKey,
      apiSecretHash,
      allowedOrigins: ['http://localhost:3000', 'http://localhost:5173'],
      enabledModules: [
        'auth',
        'user-management',
        'app-management',
        'storage',
        'billing',
        'wallet',
        'activation',
      ],
    },
  });

  console.log(`✅ Application created: ${app.name} (${app.id})`);

  // 2. Create Default Subscription Plans
  const freePlan = await prisma.subscriptionPlan.upsert({
    where: { id: 'plan-free' },
    update: {},
    create: {
      id: 'plan-free',
      name: 'Free Tier',
      description: 'Basic access with standard quotas',
      priceMinorUnits: 0,
      currency: 'USD',
      billingCycleDays: 30,
      includedWalletCredits: 50,
      enabledFeatures: ['image.upload', 'image.compression'],
    },
  });

  const proPlan = await prisma.subscriptionPlan.upsert({
    where: { id: 'plan-pro' },
    update: {},
    create: {
      id: 'plan-pro',
      name: 'Pro Tier',
      description: 'Advanced features with high-volume limits',
      priceMinorUnits: 1999,
      currency: 'USD',
      billingCycleDays: 30,
      includedWalletCredits: 1000,
      enabledFeatures: ['image.upload', 'image.compression', 'video.processing', 'ai.analysis'],
    },
  });

  console.log(`✅ Plans seeded: ${freePlan.name}, ${proPlan.name}`);

  // 3. Create Admin Users
  const adminPasswordHash = await argon2.hash('Password123!');

  const adminUser1 = await prisma.user.upsert({
    where: { email: 'admin@modular-platform.io' },
    update: { passwordHash: adminPasswordHash },
    create: {
      email: 'admin@modular-platform.io',
      passwordHash: adminPasswordHash,
      firstName: 'Platform',
      lastName: 'Super Admin',
      isEmailVerified: true,
      userAppRoles: {
        create: {
          appId: app.id,
          role: 'SUPER_ADMIN',
          permissions: ['*'],
        },
      },
      wallets: {
        create: {
          appId: app.id,
          balanceMinorUnits: 5000,
          currency: 'CREDITS',
        },
      },
    },
  });

  const adminUser2 = await prisma.user.upsert({
    where: { email: 'admin@modularplatform.io' },
    update: { passwordHash: adminPasswordHash },
    create: {
      email: 'admin@modularplatform.io',
      passwordHash: adminPasswordHash,
      firstName: 'Platform',
      lastName: 'Admin',
      isEmailVerified: true,
      userAppRoles: {
        create: {
          appId: app.id,
          role: 'SUPER_ADMIN',
          permissions: ['*'],
        },
      },
      wallets: {
        create: {
          appId: app.id,
          balanceMinorUnits: 5000,
          currency: 'CREDITS',
        },
      },
    },
  });

  console.log(`✅ Admin Users created: ${adminUser1.email}, ${adminUser2.email}`);
  console.log('🎉 Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
