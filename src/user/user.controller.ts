import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { User } from '@prisma/client';
import { UserService } from './user.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Пользователи (users)')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getUsers() {
    return await this.userService.users({});
  }

  @Get(':id')
  async getUser(@Param('id') id: string) {
    return await this.userService.user({ id });
  }

  @Post()
  async setUsers(@Body() dataUsers: User[]) {
    return await this.userService.createUsers(dataUsers);
  }
}
