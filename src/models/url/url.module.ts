import { Module } from '@nestjs/common';
import { UrlService } from './url.service';
import { UrlController } from './url.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CORE } from 'src/common/constants/constants';
import { Url } from './entities/url.entity';
import { User } from '../user/entities/user.entity';

@Module({
  controllers: [UrlController],
  providers: [UrlService],
  imports: [
    TypeOrmModule.forFeature([User, Url], CORE)
  ],
})
export class UrlModule { }
