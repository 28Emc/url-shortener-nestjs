import { Controller, Get, Param, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Request, Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get(':urlUUID')
  async redirectFromShortUrl(@Req() req: Request, @Res() res: Response, @Param('urlUUID') urlUUID: string) {
    const originalUrl: string = await this.appService.redirectFromShortUrl(req, urlUUID);
    return res.redirect(originalUrl);
  }
}
