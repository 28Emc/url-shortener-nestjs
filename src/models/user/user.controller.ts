import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, HttpCode } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateStatusUserDto } from './dto/update-status-user.dto';
import { ApiBody, ApiCreatedResponse, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { User } from './entities/user.entity';
import { ApiResponseErrorDto, ApiResponseListDto, ApiResponseObjectDto } from 'src/common/dtos/api-response.dto';

@ApiTags('User')
@Controller('v1/api/shortener/users')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @ApiOperation({ summary: 'Endpoint to create a user.', operationId: 'post-user' })
  @ApiCreatedResponse({ description: 'User created', type: ApiResponseObjectDto<User> })
  @ApiInternalServerErrorResponse({ description: 'Internal server error', type: ApiResponseErrorDto })
  @ApiBody({ type: CreateUserDto, required: true })
  @HttpCode(HttpStatus.CREATED)
  @Post()
  create(@Body() createUserDto: CreateUserDto): Promise<ApiResponseObjectDto<string>> {
    return this.userService.create(createUserDto);
  }

  @ApiOperation({ summary: 'Endpoint to fetch all users.', operationId: 'fetch-user' })
  @ApiOkResponse({ description: 'Users found', type: ApiResponseListDto<User> })
  @ApiInternalServerErrorResponse({ description: 'Internal server error', type: ApiResponseErrorDto })
  @HttpCode(HttpStatus.OK)
  @Get()
  findAll(): Promise<ApiResponseListDto<User>> {
    return this.userService.findAll();
  }

  @ApiOperation({ summary: 'Endpoint to get user by ID.', operationId: 'fetch-user-id' })
  @ApiOkResponse({ description: 'Urls found', type: ApiResponseListDto<User> })
  @ApiNotFoundResponse({ description: 'User not found', type: ApiResponseErrorDto })
  @ApiInternalServerErrorResponse({ description: 'Internal server error', type: ApiResponseErrorDto })
  @ApiParam({ name: 'id', type: String, required: true })
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  findOne(@Param('id') id: string): Promise<ApiResponseObjectDto<User>> {
    return this.userService.findOne(+id);
  }

  @ApiOperation({ summary: 'Endpoint to update the user.', operationId: 'update-user' })
  @ApiOkResponse({ description: 'User updated', type: ApiResponseObjectDto<string> })
  @ApiNotFoundResponse({ description: 'User not found', type: ApiResponseErrorDto })
  @ApiParam({ name: 'id', type: String, required: true })
  @ApiBody({ type: UpdateUserDto, required: true })
  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<ApiResponseObjectDto<string>> {
    return this.userService.update(+id, updateUserDto);
  }

  @ApiOperation({ summary: 'Endpoint to delete the user.', operationId: 'delete-user' })
  @ApiOkResponse({ description: 'User deleted', type: ApiResponseObjectDto<string> })
  @ApiNotFoundResponse({ description: 'User not found', type: ApiResponseErrorDto })
  @ApiParam({ name: 'id', type: String, required: true })
  @ApiBody({ type: UpdateStatusUserDto, required: true })
  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  remove(@Param('id') id: string, @Body() updateStatusUserDto: UpdateStatusUserDto): Promise<ApiResponseObjectDto<string>> {
    return this.userService.remove(+id, updateStatusUserDto);
  }

  @ApiOperation({ summary: 'Endpoint to restore the user.', operationId: 'restore-user' })
  @ApiOkResponse({ description: 'User restored', type: ApiResponseObjectDto<string> })
  @ApiNotFoundResponse({ description: 'User not found', type: ApiResponseErrorDto })
  @ApiParam({ name: 'id', type: String, required: true })
  @ApiBody({ type: UpdateStatusUserDto, required: true })
  @HttpCode(HttpStatus.OK)
  @Delete(':id/restore')
  restore(@Param('id') id: string, @Body() updateStatusUserDto: UpdateStatusUserDto) {
    return this.userService.restore(+id, updateStatusUserDto);
  }
}
