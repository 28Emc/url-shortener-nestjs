import { Controller, Get, Param } from '@nestjs/common';
import { StatisticService } from './statistic.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Statistic')
@Controller('v1/api/statistics')
export class StatisticController {
  constructor(private readonly statisticService: StatisticService) { }

  @Get()
  findAll() {
    return this.statisticService.findAll();
  }

  @Get(':urlId')
  findByUrlId(@Param('urlId') urlId: string) {
    return this.statisticService.findByUrlId(urlId);
  }
}
