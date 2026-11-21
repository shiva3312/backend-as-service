import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: true }),
  );

  // Set global API routing prefix (/api/v1/auth/login, /api/v1/apps, etc.)
  app.setGlobalPrefix('api');

  // Enable CORS for frontend applications (web admin portal, mobile apps, SPAs)
  app.enableCors({
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'x-app-id',
      'Accept',
      'Origin',
      'X-Requested-With',
    ],
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Modular Backend Platform API')
    .setDescription('Production-grade Backend-as-a-Service REST endpoints & OpenAPI specs')
    .setVersion('1.0')
    .addApiKey({ type: 'apiKey', name: 'x-app-id', in: 'header' }, 'x-app-id')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');
  console.log(`🚀 Gateway API server running on port ${port} (Swagger docs: http://localhost:${port}/api/docs)`);
}

bootstrap();
