import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostgreSQLModule } from './providers/database/postgreSQL/postgresql.module';
import { CORE, ENV_FILE_PATH } from './common/constants/constants';
import { ConfigModule } from '@nestjs/config';
import { UrlModule } from './models/url/url.module';
import { UserModule } from './models/user/user.module';
import { StatisticModule } from './models/statistic/statistic.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Url } from './models/url/entities/url.entity';
import { User } from './models/user/entities/user.entity';
import { Statistic } from './models/statistic/entities/statistic.entity';
import { HttpModule } from '@nestjs/axios';
import { RedisModule } from './providers/cache/redis/redis.module';
const redisStore = require('cache-manager-redis-store').redisStore;

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ENV_FILE_PATH,
    }),
    PostgreSQLModule,
    UrlModule,
    UserModule,
    StatisticModule,
    TypeOrmModule.forFeature([User, Url, Statistic], CORE),
    HttpModule,
    RedisModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
