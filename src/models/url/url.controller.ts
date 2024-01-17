import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UrlService } from './url.service';
import { CreateUrlDto } from './dto/create-url.dto';
import { UpdateUrlDto } from './dto/update-url.dto';
import { UpdateUrlCountsDto } from './dto/update-url-counts.dto';

@Controller('/api/urls')
export class UrlController {
  constructor(private readonly urlService: UrlService) { }

  @Post()
  create(@Body() createUrlDto: CreateUrlDto) {
    return this.urlService.create(createUrlDto);
  }

  @Get()
  findAll() {
    return this.urlService.findAll();
  }

  @Get('/user/:userId')
  findAllByUserId(@Param('userId') userId: string) {
    return this.urlService.findAllByUserId(+userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.urlService.findOne(+id);
  }

  @Get('/uuid/:uuid')
  findOneByUUID(@Param('uuid') uuid: string) {
    return this.urlService.findOneByUUID(uuid);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUrlDto: UpdateUrlDto) {
    return this.urlService.update(+id, updateUrlDto);
  }

  @Patch('/counts')
  updateCounts(@Body() updateUrlCountsDto: UpdateUrlCountsDto) {
    return this.urlService.updateCounts(updateUrlCountsDto);
  }

  @Delete(':uuid')
  remove(@Param('uuid') uuid: string) {
    return this.urlService.remove(uuid);
  }
}
