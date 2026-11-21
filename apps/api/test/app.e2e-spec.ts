import { Test, TestingModule } from '@nestjs/testing';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { prisma } from '@modular-platform/database';

describe('API Gateway E2E Tests', () => {
  let app: NestFastifyApplication;

  const users = new Map<string, any>();
  const wallets = new Map<string, any>();
  const activationKeys = new Map<string, any>();

  beforeAll(async () => {
    jest.spyOn(prisma.user, 'findUnique').mockImplementation((async (args: any) => {
      if (args.where?.email) {
        return Array.from(users.values()).find((u) => u.email === args.where.email) || null;
      }
      if (args.where?.id) {
        return users.get(args.where.id) || null;
      }
      return null;
    }) as any);

    jest.spyOn(prisma.user, 'create').mockImplementation((async (args: any) => {
      const user = {
        id: `user-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        status: 'ACTIVE',
        createdAt: new Date(),
        updatedAt: new Date(),
        ...args.data,
      };
      users.set(user.id, user);
      return user;
    }) as any);

    jest.spyOn(prisma.wallet, 'upsert').mockImplementation((async (args: any) => {
      const userId = args.where?.userId_appId?.userId || args.create?.userId || 'test-user';
      const appId = args.where?.userId_appId?.appId || args.create?.appId || 'test-app-id';
      const key = `${userId}_${appId}`;
      if (wallets.has(key)) {
        return wallets.get(key);
      }
      const wallet = {
        id: `wallet-${Date.now()}`,
        userId,
        appId,
        balanceMinorUnits: args.create?.balanceMinorUnits || 0,
        currency: args.create?.currency || 'CREDITS',
      };
      wallets.set(key, wallet);
      return wallet;
    }) as any);

    jest.spyOn(prisma.activationKey, 'create').mockImplementation((async (args: any) => {
      const keyRecord = {
        id: `key-${Date.now()}`,
        usedActivations: 0,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        ...args.data,
      };
      activationKeys.set(keyRecord.id, keyRecord);
      return keyRecord;
    }) as any);

    jest.spyOn(prisma, '$transaction').mockImplementation((async (cb: any) => {
      return cb(prisma);
    }) as any);

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication<NestFastifyApplication>(new FastifyAdapter());
    await app.init();
    await app.getHttpAdapter().getInstance().ready();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Authentication Endpoints (/v1/auth)', () => {
    it('POST /v1/auth/register should register a user identity', async () => {
      const response = await request(app.getHttpServer())
        .post('/v1/auth/register')
        .send({
          email: `e2e-user-${Date.now()}@example.com`,
          password: 'Password123!',
          firstName: 'E2E',
          lastName: 'Tester',
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('userId');
      expect(response.body.data).toHaveProperty('email');
    });

    it('POST /v1/auth/login should authenticate user and issue tokens', async () => {
      const testEmail = `login-${Date.now()}@example.com`;
      const testPassword = 'Password123!';

      // Register first
      await request(app.getHttpServer())
        .post('/v1/auth/register')
        .send({ email: testEmail, password: testPassword });

      // Login
      const response = await request(app.getHttpServer())
        .post('/v1/auth/login')
        .send({ email: testEmail, password: testPassword });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('accessToken');
      expect(response.body.data).toHaveProperty('refreshToken');
    });
  });

  describe('Tenant Isolation Guard & Wallet (/v1/wallet)', () => {
    it('GET /v1/wallet should fail with 403 when x-app-id is missing', async () => {
      const response = await request(app.getHttpServer()).get('/v1/wallet');
      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('UNAUTHORIZED_TENANT_ACCESS');
    });

    it('GET /v1/wallet should succeed when x-app-id header is provided', async () => {
      const response = await request(app.getHttpServer())
        .get('/v1/wallet')
        .set('x-app-id', 'test-app-id');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('balanceMinorUnits');
    });
  });

  describe('Activation & License Keys (/v1/activation)', () => {
    it('POST /v1/activation/generate should generate license key', async () => {
      const response = await request(app.getHttpServer())
        .post('/v1/activation/generate')
        .send({
          appId: 'test-app-id',
          prefix: 'TEST',
          grantCredits: 100,
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('keyString');
      expect(response.body.data.keyPrefix).toBe('TEST');
    });
  });
});
