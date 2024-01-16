import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { PORT } from './common/constants/constants';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { BadRequestExceptionFilter } from './common/filters/bad-request-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    rawBody: true,
    logger: ['debug']
  });
  const configService = app.get(ConfigService);

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
