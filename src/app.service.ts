import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Url } from './models/url/entities/url.entity';
import { Request } from 'express';
import { AxiosResponse } from 'axios';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { StatisticService } from './models/statistic/statistic.service';
import { UrlService } from './models/url/url.service';
import { PORT } from './common/constants/constants';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(
    private readonly httpService: HttpService,
    private urlService: UrlService,
    private statisticService: StatisticService,
    private configService: ConfigService
  ) { }

  ping(): string {
    return `Url shortener API listening on port ${this.configService.get<string>(PORT)}`;
  }

  async redirectFromShortUrl(req: Request, urlUUID: string) {
    const updatedUrlResponse = await this.urlService.updateCounts({
      uuid: urlUUID,
      clickNro: 1
    });
    if (!updatedUrlResponse.details.urlId) {
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
    const createdStatisticResponse = await this.statisticService.create({
      urlId: updatedUrlResponse.details.urlId.toString(),
      browserInfo: req.headers['user-agent'],
      locationInfo: fullLocation
    });
    if (!createdStatisticResponse.details.statisticId) {
      throw new InternalServerErrorException({
        'message': 'There was an error',
        'details': 'Internal server error'
      });
    }
    return updatedUrlResponse.details.originalUrl;
  }

  private async findLocationByReqIP(ip: string): Promise<AxiosResponse<any>> {
    return await firstValueFrom(this.httpService.get(`https://ipapi.co/${ip}/json/`));
  }

  private isValidLocation(location: any): boolean {
    return location['ip'] && location['city'] && location['country_name'] && location['country_code'] && location['latitude'] && location['longitude'];
  }
}
