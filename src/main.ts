import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { BASE_URL, LOCAL, PORT, VERSION } from './common/constants/constants';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { BadRequestExceptionFilter } from './common/filters/bad-request-exception.filter';
import { DocumentBuilder, SwaggerDocumentOptions, SwaggerCustomOptions, SwaggerModule } from '@nestjs/swagger';
import { Url } from './models/url/entities/url.entity';
import { User } from './models/user/entities/user.entity';
import { Statistic } from './models/statistic/entities/statistic.entity';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);

  const globalPrefix = `${configService.get<string>(VERSION)}/api`;
  const hostDomain = process.env.NODE_ENV === LOCAL ? `${configService.get<string>(BASE_URL)}:${configService.get<string>(PORT)}` : `${configService.get<string>(BASE_URL)}`;
  const serverDescription = process.env.NODE_ENV === LOCAL ? 'Servidor local' : 'Servidor de producción';
  const swConfig = new DocumentBuilder()
    .setTitle('Ms Auth')
    .setDescription('Proyecto API REST de prueba de acortador de urls.')
    .setVersion('1.0.0')
    .addServer(`${hostDomain}`, serverDescription)
    .build();
  const swOptions: SwaggerDocumentOptions = {
    extraModels: [Url, User, Statistic]
  };
  const swCustomOptions: SwaggerCustomOptions = {
    customSiteTitle: 'URL Shortener - API Docs',
    swaggerOptions: {
      showRequestDuration: true
    },
  };
  const document = SwaggerModule.createDocument(app, swConfig, swOptions);
  SwaggerModule.setup(`${globalPrefix}/docs`, app, document, swCustomOptions);

  /* app.setGlobalPrefix('/api', {
    exclude: [
      { path: '/', method: RequestMethod.GET },
      { path: '/:uuid', method: RequestMethod.GET },
    ],
  }); */
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
