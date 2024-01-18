import { Controller, Get, Param, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Request, Response } from 'express';
import { ApiExcludeController } from '@nestjs/swagger';

@ApiExcludeController()
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  ping(): string {
    return this.appService.ping();
  }

  @Get(':urlUUID')
  async redirectFromShortUrl(@Req() req: Request, @Res() res: Response, @Param('urlUUID') urlUUID: string) {
    const originalUrl: string = await this.appService.redirectFromShortUrl(req, urlUUID);
    return res.redirect(originalUrl);
  }
}
