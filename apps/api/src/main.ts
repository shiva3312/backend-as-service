import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: true }),
  );

  const config = new DocumentBuilder()
    .setTitle('Modular Backend Platform API')
    .setDescription('Production-grade Backend-as-a-Service REST endpoints & OpenAPI specs')
    .setVersion('1.0')
    .addApiKey({ type: 'apiKey', name: 'x-app-id', in: 'header' }, 'x-app-id')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');
  console.log(`🚀 Gateway API server running on port ${port}`);
}

bootstrap();
