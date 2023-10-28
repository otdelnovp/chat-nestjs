import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder, SwaggerCustomOptions } from '@nestjs/swagger';
import { join } from 'path';
import { globalDocs } from './global/global.docs';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableShutdownHooks();
  app.setGlobalPrefix(globalDocs.prefix);

  // Swagger
  const config = new DocumentBuilder()
    .setTitle(globalDocs.title)
    .setDescription(globalDocs.description)
    .setVersion(globalDocs.version)
    .build();
  const customOptions: SwaggerCustomOptions = {
    customSiteTitle: globalDocs.title,
    customCss: '#swagger-ui .topbar{display:none}',
    swaggerOptions: {
      supportedSubmitMethods: [],
      defaultModelExpandDepth: 10,
      defaultModelsExpandDepth: -1,
    },
  };
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(globalDocs.prefix, app, document, customOptions);

  // CORS
  const corsOriginsArr = process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : null;
  const corsConfig = { credentials: true, origin: corsOriginsArr || '*' };
  app.enableCors(corsConfig);

  // Client static views
  app.useStaticAssets(join(__dirname, '..', 'static'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('ejs');

  await app.listen(process.env.PORT || 3000, () =>
    console.log(`Server "${globalDocs.title}" started on ${process.env.PORT}`),
  );
}
bootstrap();
