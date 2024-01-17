import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { StatisticService } from './statistic.service';
import { CreateStatisticDto } from './dto/create-statistic.dto';

@Controller('statistic')
export class StatisticController {
  constructor(private readonly statisticService: StatisticService) { }

  @Post()
  create(@Body() createStatisticDto: CreateStatisticDto) {
    return this.statisticService.create(createStatisticDto);
  }

  @Get()
  findAll() {
    return this.statisticService.findAll();
  }

  @Get(':urlId')
  findByUrlId(@Param('urlId') urlId: string) {
    return this.statisticService.findByUrlId(urlId);
  }
}
