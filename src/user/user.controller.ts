import { Body, Controller, Get, HttpStatus, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

import { GetUserDto } from './dto/get-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateUserResponseDto } from './dto/create-user-response.dto';

@ApiTags('Пользователи (users)')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Получить список пользователей' })
  @ApiResponse({ status: HttpStatus.OK, type: GetUserDto, isArray: true })
  @Get()
  async getUsers() {
    return await this.userService.users({});
  }

  ////

  @ApiOperation({ summary: 'Получить данные одного пользователя' })
  @ApiResponse({ status: HttpStatus.OK, type: GetUserDto })
  @ApiParam({
    name: 'id',
    description: 'UUID пользователя',
    example: 'aea0733d-57f9-43f1-9f70-48cceda0d53a',
  })
  @Get(':id')
  async getUser(@Param('id') id: string) {
    return await this.userService.user({ id });
  }

  ////

  @ApiOperation({ summary: 'Добавление пользователей (импорт из внешней системы)' })
  @ApiBody({ type: CreateUserDto, isArray: true })
  @ApiResponse({ status: HttpStatus.CREATED, type: CreateUserResponseDto })
  @Post()
  async setUsers(@Body() dataUsersDto: CreateUserDto[]) {
    return await this.userService.createUsers(dataUsersDto);
  }
}
