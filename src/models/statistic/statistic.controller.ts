import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { StatisticService } from './statistic.service';
import { ApiInternalServerErrorResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { ApiResponseListDto, ApiResponseErrorDto } from 'src/common/dtos/api-response.dto';
import { Statistic } from './entities/statistic.entity';

@ApiTags('Statistic')
@Controller('v1/api/statistics')
export class StatisticController {
  constructor(private readonly statisticService: StatisticService) { }

  @ApiOperation({ summary: 'Endpoint to fetch all url statistics.', operationId: 'fetch-statistic' })
  @ApiOkResponse({ description: 'Statistics found', type: ApiResponseListDto<Statistic> })
  @ApiInternalServerErrorResponse({ description: 'Internal server error', type: ApiResponseErrorDto })
  @HttpCode(HttpStatus.OK)
  @Get()
  findAll(): Promise<ApiResponseListDto<Statistic>> {
    return this.statisticService.findAll();
  }

  @ApiOperation({ summary: 'Endpoint to fetch url statistics by url Id.', operationId: 'fetch-statistic-id' })
  @ApiOkResponse({ description: 'Statistics found', type: ApiResponseListDto<Statistic> })
  @ApiInternalServerErrorResponse({ description: 'Internal server error', type: ApiResponseErrorDto })
  @ApiParam({ name: 'urlId', type: String, required: true })
  @HttpCode(HttpStatus.OK)
  @Get(':urlId')
  findByUrlId(@Param('urlId') urlId: string): Promise<ApiResponseListDto<Statistic>> {
    return this.statisticService.findByUrlId(urlId);
  }
}
