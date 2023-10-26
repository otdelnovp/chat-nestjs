import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder, SwaggerCustomOptions } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableShutdownHooks();

  const siteTitle = 'Chat NestJS';
  const config = new DocumentBuilder()
    .setTitle(siteTitle)
    .setDescription(
      'API для чатов на NestJS с использованием REST архитектуры\n\nБаза данных на PostgreSQL',
    )
    .setVersion('1.0')
    .build();
  const customOptions: SwaggerCustomOptions = {
    customSiteTitle: siteTitle,
    swaggerOptions: {
      supportedSubmitMethods: [],
      defaultModelExpandDepth: 10,
      defaultModelsExpandDepth: -1,
    },
  };
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('', app, document, customOptions);

  const corsOriginsArr = process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : null;
  const corsConfig = { credentials: true, origin: corsOriginsArr || '*' };
  app.enableCors(corsConfig);

  app.useStaticAssets(join(__dirname, '..', 'static'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('ejs');

  await app.listen(process.env.PORT || 3000, () =>
    console.log(`Server "Chat NestJS" started on ${process.env.PORT}`),
  );
}
bootstrap();
