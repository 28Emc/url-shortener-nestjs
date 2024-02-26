import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { API_KEY, X_API_KEY_HEADER } from 'src/common/constants/constants';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private configService: ConfigService) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const apiKey = request.headers[X_API_KEY_HEADER];
    console.log('apiKey', apiKey)
    if (!apiKey) {
      throw new UnauthorizedException(`API key is missing. You must provide '${X_API_KEY_HEADER}' header`, {
        description: 'Authorization error'
      });
    }
    console.log('this.configService.get(API_KEY)', this.configService.get(API_KEY))
    if (apiKey !== this.configService.get(API_KEY)) {
      throw new UnauthorizedException('Invalid API key.', {
        description: 'Authorization error'
      });
    }
    return true;
  }
}


