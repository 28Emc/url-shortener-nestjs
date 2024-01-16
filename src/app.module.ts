import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostgreSQLModule } from './providers/database/postgreSQL/postgresql.module';
import { ENV_FILE_PATH } from './common/constants/constants';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ENV_FILE_PATH,
    }),
    PostgreSQLModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
