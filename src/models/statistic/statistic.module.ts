import { Module } from '@nestjs/common';
import { StatisticService } from './statistic.service';
import { StatisticController } from './statistic.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CORE } from 'src/common/constants/constants';
import { Url } from '../url/entities/url.entity';
import { User } from '../user/entities/user.entity';
import { Statistic } from './entities/statistic.entity';

@Module({
  controllers: [StatisticController],
  providers: [StatisticService],
  imports: [
    TypeOrmModule.forFeature([User, Url, Statistic], CORE),
  ],
  exports: [StatisticService],
})
export class StatisticModule { }
