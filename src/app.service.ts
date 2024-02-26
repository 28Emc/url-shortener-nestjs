import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Request } from 'express';
import { AxiosResponse } from 'axios';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { StatisticService } from './models/statistic/statistic.service';
import { UrlService } from './models/url/url.service';
import { PORT, STATISTIC_URL } from './common/constants/constants';
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
    if (!updatedUrlResponse.detail.urlId) {
      throw new InternalServerErrorException({
        'message': 'There was an error',
        'detail': 'Url not found'
      });
    }
    const location = await this.findLocationByReqIP(req.ip);
    let fullLocation: string = '';
    if (this.isValidLocation(location.data)) {
      fullLocation = location['ip'] + '|' + location['city'] + '|' + location['country_name'] + '|' + location['country_code'] + '|' + location['latitude'] + '|' + location['longitude'];
    }
    const createdStatisticResponse = await this.statisticService.create({
      urlId: updatedUrlResponse.detail.urlId.toString(),
      browserInfo: req.headers['user-agent'],
      locationInfo: fullLocation
    });
    if (!createdStatisticResponse.detail.statisticId) {
      throw new InternalServerErrorException({
        'message': 'There was an error',
        'detail': 'Internal server error'
      });
    }
    return updatedUrlResponse.detail.originalUrl;
  }

  private async findLocationByReqIP(ip: string): Promise<AxiosResponse<any>> {
    return await firstValueFrom(this.httpService.get(`${this.configService.get(STATISTIC_URL)}/${ip}/json/`));
  }

  private isValidLocation(location: any): boolean {
    return location['ip'] && location['city'] && location['country_name'] && location['country_code'] && location['latitude'] && location['longitude'];
  }
}
