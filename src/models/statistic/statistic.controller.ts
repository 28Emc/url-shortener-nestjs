import { Controller, Get, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { StatisticService } from './statistic.service';
import { ApiInternalServerErrorResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiResponseListDto, ApiResponseErrorDto } from 'src/common/dtos/api-response.dto';
import { Statistic } from './entities/statistic.entity';
import { ApiKeyGuard } from 'src/common/guards/api-key/api-key.guard';

@ApiTags('Statistic')
@Controller('v1')
export class StatisticController {
  constructor(private readonly statisticService: StatisticService) { }

  @ApiOperation({ summary: 'Endpoint to fetch all url statistics.', operationId: 'fetch-statistic' })
  @ApiOkResponse({ description: 'Statistics found', type: ApiResponseListDto<Statistic> })
  @ApiInternalServerErrorResponse({ description: 'Internal server error', type: ApiResponseErrorDto })
  @HttpCode(HttpStatus.OK)
  @UseGuards(ApiKeyGuard)
  @Get('/api/statistics')
  findAll(): Promise<ApiResponseListDto<Statistic>> {
    return this.statisticService.findAll();
  }

  /* @ApiOperation({ summary: 'Endpoint to fetch url statistics by url Id.', operationId: 'fetch-statistic-id' })
  @ApiOkResponse({ description: 'Statistics found', type: ApiResponseListDto<Statistic> })
  @ApiInternalServerErrorResponse({ description: 'Internal server error', type: ApiResponseErrorDto })
  @ApiParam({ name: 'urlId', type: String, required: true })
  @HttpCode(HttpStatus.OK)
  @UseGuards(ApiKeyGuard)
  @Get('/api/statistics/:urlId')
  findByUrlId(@Param('urlId') urlId: string): Promise<ApiResponseListDto<Statistic>> {
    return this.statisticService.findByUrlId(urlId);
  } */
}
