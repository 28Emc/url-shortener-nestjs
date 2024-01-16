import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { PORT } from './common/constants/constants';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    rawBody: true,
    logger: ['debug']
  });
  const configService = app.get(ConfigService);

  app.useBodyParser('json', { limit: '1mb' });
  app.enableCors();

  await app.listen(configService.get<string>(PORT));
  console.log(`Url shortener listening on port ${configService.get<string>(PORT)}`);
}
bootstrap();
