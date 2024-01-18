import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { BASE_URL, LOCAL, PORT, VERSION } from './common/constants/constants';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { BadRequestExceptionFilter } from './common/filters/bad-request-exception.filter';
import { DocumentBuilder, SwaggerDocumentOptions, SwaggerCustomOptions, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);

  const globalPrefix = `${configService.get<string>(VERSION)}/api`;
  const hostDomain = process.env.NODE_ENV === LOCAL ? `${configService.get<string>(BASE_URL)}:${configService.get<string>(PORT)}` : `${configService.get<string>(BASE_URL)}`;
  const serverDescription = process.env.NODE_ENV === LOCAL ? 'Localhost server' : 'Production server';
  const swConfig = new DocumentBuilder()
    .setTitle('URL shortener API')
    .setDescription('API Rest project to manage short urls.')
    .setVersion('1.0.0')
    .addServer(`${hostDomain}`, serverDescription)
    .build();
  const swOptions: SwaggerDocumentOptions = {
    extraModels: [],
    include: []
  };
  const swCustomOptions: SwaggerCustomOptions = {
    customSiteTitle: 'URL Shortener - API Docs',
    swaggerOptions: {
      showRequestDuration: true
    },
  };
  const document = SwaggerModule.createDocument(app, swConfig, swOptions);
  SwaggerModule.setup(`${globalPrefix}/docs`, app, document, swCustomOptions);

  app.useGlobalFilters(new BadRequestExceptionFilter());
  app.useGlobalPipes(new ValidationPipe({
    transformOptions: {
      enableImplicitConversion: true,
    }
  }));
  app.useBodyParser('json', { limit: '1mb' });
  app.enableCors();

  await app.listen(configService.get<string>(PORT));
  console.log(`Url shortener listening on port ${configService.get<string>(PORT)}`);
}
bootstrap();
