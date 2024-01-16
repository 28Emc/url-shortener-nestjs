import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { CORE } from './common/constants/constants';
import { Url } from './models/url/entities/url.entity';
import { Statistic } from './models/statistic/entities/statistic.entity';
import { Request } from 'express';
import { AxiosResponse } from 'axios';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Url, CORE)
    private readonly urlRepository: Repository<Url>,
    @InjectRepository(Statistic, CORE)
    private readonly statisticRepository: Repository<Statistic>,
    private readonly httpService: HttpService
  ) { }
  getHello(): string {
    return 'Hello World!';
  }

  async redirectFromShortUrl(req: Request, urlUUID: string): Promise<string> {
    const urlFound: Url = await this.urlRepository.findOne({
      where: {
        uuid: urlUUID
      }
    });
    if (!urlFound) {
      throw new NotFoundException({
        'message': 'There was an error',
        'details': 'Url not found'
      });
    }
    const updatedUrl: UpdateResult = await this.urlRepository.update({
      urlId: urlFound.urlId
    }, {
      clickNro: urlFound.clickNro + 1
    });
    if (!updatedUrl.affected) {
      throw new InternalServerErrorException({
        'message': 'There was an error',
        'details': 'Url not found'
      });
    }
    const location = await this.findLocationByReqIP(req.ip);
    let fullLocation: string = '';
    if (this.isValidLocation(location.data)) {
      fullLocation = location['ip'] + '|' + location['city'] + '|' + location['country_name'] + '|' + location['country_code'] + '|' + location['latitude'] + '|' + location['longitude'];
    }
    const createdStatistic: Statistic = await this.statisticRepository.save({
      url: urlFound,
      browserInfo: req.headers['user-agent'],
      locationInfo: fullLocation
    });
    if (!createdStatistic.statisticId) {
      throw new InternalServerErrorException({
        'message': 'There was an error',
        'details': 'Internal server error'
      });
    }
    return urlFound.originalUrl;
  }

  private async findLocationByReqIP(ip: string): Promise<AxiosResponse<any>> {
    return await firstValueFrom(this.httpService.get(`https://ipapi.co/${ip}/json/`));
  }

  private isValidLocation(location: any): boolean {
    return location['ip'] && location['city'] && location['country_name'] && location['country_code'] && location['latitude'] && location['longitude'];
  }
}
