import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { User } from '@prisma/client';
import { UserService } from './user.service';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

@ApiTags('Пользователи (users)')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Получить список пользователей' })
  @Get()
  async getUsers() {
    return await this.userService.users({});
  }

  @ApiOperation({ summary: 'Получить данные одного пользователя' })
  @ApiParam({
    name: 'id',
    description: 'UUID пользователя',
    example: 'aea0733d-57f9-43f1-9f70-48cceda0d53a',
  })
  @Get(':id')
  async getUser(@Param('id') id: string) {
    return await this.userService.user({ id });
  }

  @ApiOperation({ summary: 'Добавление пользователя' })
  @Post()
  async setUsers(@Body() dataUsers: User[]) {
    return await this.userService.createUsers(dataUsers);
  }
}
