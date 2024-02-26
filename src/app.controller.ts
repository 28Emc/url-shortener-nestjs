import { Controller, Get, Param, ParseUUIDPipe, Req, Res, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { Request, Response } from 'express';
import { ApiExcludeController } from '@nestjs/swagger';
import { ApiKeyGuard } from './common/guards/api-key/api-key.guard';

@ApiExcludeController()
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  @UseGuards(ApiKeyGuard)
  ping(): string {
    return this.appService.ping();
  }

  @Get(':uuid')
  async redirectFromShortUrl(@Req() req: Request, @Res() res: Response, @Param('uuid', ParseUUIDPipe) uuid: string) {
    const originalUrl: string = await this.appService.redirectFromShortUrl(req, uuid);
    return res.redirect(originalUrl);
  }
}
