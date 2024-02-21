import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateStatisticDto } from './dto/create-statistic.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CORE } from 'src/common/constants/constants';
import { Repository } from 'typeorm';
import { Url } from '../url/entities/url.entity';
import { Statistic } from './entities/statistic.entity';
import { ApiResponseListDto, ApiResponseObjectDto } from 'src/common/dtos/api-response.dto';

@Injectable()
export class StatisticService {
  constructor(
    @InjectRepository(Url, CORE)
    private readonly urlRepository: Repository<Url>,
    @InjectRepository(Statistic, CORE)
    private readonly statisticRepository: Repository<Statistic>
  ) { }

  async create(createStatisticDto: CreateStatisticDto): Promise<ApiResponseObjectDto<Statistic>> {
    const urlFound: Url = await this.urlRepository.findOne({
      where: {
        urlId: +createStatisticDto.urlId
      }
    });
    if (!urlFound) {
      throw new NotFoundException({
        'message': 'There was an error while creating the statistic',
        'detail': 'Url not found'
      });
    }
    const createdStatistic: Statistic = await this.statisticRepository.save({
      url: urlFound,
      browserInfo: createStatisticDto.browserInfo,
      locationInfo: createStatisticDto.locationInfo
    });
    return {
      'message': 'Statistic created successfully',
      'detail': createdStatistic
    };
  }

  async findAll(): Promise<ApiResponseListDto<Statistic>> {
    const statisticList: Statistic[] = await this.statisticRepository.find({
      loadRelationIds: {
        relations: ['url'],
        disableMixedMap: true
      }
    });
    if (!statisticList) {
      throw new InternalServerErrorException({
        'message': 'There was an error while fetching statistic',
        'detail': 'Internal server error'
      });
    }
    return {
      'message': 'Statistic data retrieved successfully',
      'detail': statisticList
    };
  }

  async findByUrlId(urlId: string): Promise<ApiResponseListDto<Statistic>> {
    const statiticList: Statistic[] = await this.statisticRepository.find({
      loadRelationIds: {
        relations: ['url'],
        disableMixedMap: true
      },
      where: {
        url: {
          urlId: +urlId
        }
      }
    });
    if (!statiticList) {
      throw new InternalServerErrorException({
        'message': 'There was an error while fetching statitics',
        'detail': 'Internal server error'
      });
    }
    return {
      'message': 'statitics data retrieved successfully',
      'detail': statiticList
    };
  }
}
