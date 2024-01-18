import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { UrlService } from './url.service';
import { CreateUrlDto } from './dto/create-url.dto';
import { UpdateUrlDto } from './dto/update-url.dto';
import { UpdateUrlCountsDto } from './dto/update-url-counts.dto';
import { ApiBody, ApiCreatedResponse, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { ApiResponseListDto, ApiResponseObjectDto, ApiResponseErrorDto } from 'src/common/dtos/api-response.dto';
import { Url } from './entities/url.entity';

@ApiTags('Url')
@Controller('v1/api/urls')
export class UrlController {
  constructor(private readonly urlService: UrlService) { }

  @ApiOperation({ summary: 'Endpoint to create a short url.', operationId: 'post-url' })
  @ApiCreatedResponse({ description: 'Url created', type: ApiResponseObjectDto<Url> })
  @ApiNotFoundResponse({ description: 'User not found', type: ApiResponseErrorDto })
  @ApiInternalServerErrorResponse({ description: 'You have reached the limit for creating more short URLs.', type: ApiResponseErrorDto })
  @ApiBody({ type: CreateUrlDto, required: true })
  @HttpCode(HttpStatus.CREATED)
  @Post()
  create(@Body() createUrlDto: CreateUrlDto): Promise<ApiResponseObjectDto<string>> {
    return this.urlService.create(createUrlDto);
  }

  @ApiOperation({ summary: 'Endpoint to fetch all urls.', operationId: 'fetch-url' })
  @ApiOkResponse({ description: 'Urls found', type: ApiResponseListDto<Url> })
  @ApiInternalServerErrorResponse({ description: 'Internal server error', type: ApiResponseErrorDto })
  @HttpCode(HttpStatus.OK)
  @Get()
  findAll(): Promise<ApiResponseListDto<Url>> {
    return this.urlService.findAll();
  }

  @ApiOperation({ summary: 'Endpoint to fetch all urls by user ID.', operationId: 'fetch-url-user-id' })
  @ApiOkResponse({ description: 'Urls found', type: ApiResponseListDto<Url> })
  @ApiInternalServerErrorResponse({ description: 'Internal server error', type: ApiResponseErrorDto })
  @ApiParam({ name: 'userId', type: String, required: true })
  @HttpCode(HttpStatus.OK)
  @Get('/user/:userId')
  findAllByUserId(@Param('userId') userId: string): Promise<ApiResponseListDto<Url>> {
    return this.urlService.findAllByUserId(+userId);
  }

  @ApiOperation({ summary: 'Endpoint to get one url by ID.', operationId: 'fetch-url-id' })
  @ApiOkResponse({ description: 'Url found', type: ApiResponseObjectDto<Url> })
  @ApiNotFoundResponse({ description: 'Internal server error', type: ApiResponseErrorDto })
  @ApiParam({ name: 'userId', type: String, required: true })
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  findOne(@Param('id') id: string): Promise<ApiResponseObjectDto<Url>> {
    return this.urlService.findOne(+id);
  }

  @ApiOperation({ summary: 'Endpoint to get one url by UUID.', operationId: 'fetch-url-uuid' })
  @ApiOkResponse({ description: 'Url found', type: ApiResponseObjectDto<Url> })
  @ApiNotFoundResponse({ description: 'Internal server error', type: ApiResponseErrorDto })
  @ApiParam({ name: 'uuid', type: String, required: true })
  @HttpCode(HttpStatus.OK)
  @Get('/uuid/:uuid')
  findOneByUUID(@Param('uuid') uuid: string): Promise<ApiResponseObjectDto<Url>> {
    return this.urlService.findOneByUUID(uuid);
  }

  @ApiOperation({ summary: 'Endpoint to update the url.', operationId: 'update-url' })
  @ApiCreatedResponse({ description: 'Url updated', type: ApiResponseObjectDto<string> })
  @ApiNotFoundResponse({ description: 'Url not found', type: ApiResponseErrorDto })
  @ApiParam({ name: 'id', type: String, required: true })
  @ApiBody({ type: UpdateUrlDto, required: true })
  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUrlDto: UpdateUrlDto): Promise<ApiResponseObjectDto<string>> {
    return this.urlService.update(+id, updateUrlDto);
  }

  @ApiOperation({ summary: 'Endpoint to update the url counts.', operationId: 'update-url-counts' })
  @ApiOkResponse({ description: 'Url count updated', type: ApiResponseObjectDto<{ urlId: number, originalUrl: string }> })
  @ApiNotFoundResponse({ description: 'Url not found', type: ApiResponseErrorDto })
  @ApiInternalServerErrorResponse({ description: 'Internal server error', type: ApiResponseErrorDto })
  @ApiBody({ type: UpdateUrlCountsDto, required: true })
  @HttpCode(HttpStatus.OK)
  @Patch('/counts')
  updateCounts(@Body() updateUrlCountsDto: UpdateUrlCountsDto): Promise<ApiResponseObjectDto<{ urlId: number, originalUrl: string }>> {
    return this.urlService.updateCounts(updateUrlCountsDto);
  }

  @ApiOperation({ summary: 'Endpoint to delete the url.', operationId: 'delete-url' })
  @ApiOkResponse({ description: 'Url deleted', type: ApiResponseObjectDto<string> })
  @ApiNotFoundResponse({ description: 'Url not found', type: ApiResponseErrorDto })
  @ApiParam({ name: 'uuid', type: String, required: true })
  @HttpCode(HttpStatus.OK)
  @Delete(':uuid')
  remove(@Param('uuid') uuid: string): Promise<ApiResponseObjectDto<string>> {
    return this.urlService.remove(uuid);
  }
}