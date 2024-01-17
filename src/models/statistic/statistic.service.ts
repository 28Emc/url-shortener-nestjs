import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateStatisticDto } from './dto/create-statistic.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CORE } from 'src/common/constants/constants';
import { Repository } from 'typeorm';
import { Url } from '../url/entities/url.entity';
import { Statistic } from './entities/statistic.entity';

@Injectable()
export class StatisticService {
  constructor(
    @InjectRepository(Url, CORE)
    private readonly urlRepository: Repository<Url>,
    @InjectRepository(Statistic, CORE)
    private readonly statisticRepository: Repository<Statistic>
  ) { }

  async create(createStatisticDto: CreateStatisticDto) {
    const urlFound: Url = await this.urlRepository.findOne({
      where: {
        urlId: +createStatisticDto.urlId
      }
    });
    if (!urlFound) {
      throw new NotFoundException({
        'message': 'There was an error while creating the statistic',
        'details': 'Url not found'
      });
    }
    const createdStatistic: Statistic = await this.statisticRepository.save({
      url: urlFound,
      browserInfo: createStatisticDto.browserInfo,
      locationInfo: createStatisticDto.locationInfo
    });
    return {
      'message': 'Statistic created successfully',
      'details': createdStatistic
    };
  }

  async findAll() {
    const statisticList: Statistic[] = await this.statisticRepository.find({
      loadRelationIds: {
        relations: ['url'],
        disableMixedMap: true
      }
    });
    if (!statisticList) {
      throw new InternalServerErrorException({
        'message': 'There was an error while fetching statistic',
        'details': 'Internal server error'
      });
    }
    return {
      'message': 'Statistic data retrieved successfully',
      'details': statisticList
    };
  }

  async findByUrlId(urlId: string) {
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
        'details': 'Internal server error'
      });
    }
    return {
      'message': 'statitics data retrieved successfully',
      'details': statiticList
    };
  }
}
