import { Body, Controller, Get, Param, Post, Render } from '@nestjs/common';
import { User } from '@prisma/client';
import { UserService } from './user.service';

@Controller('api')
export class AppController {
  constructor(private readonly userService: UserService) {}

  @Get('users')
  async getUsers() {
    return await this.userService.users({});
  }

  @Get('users/:id')
  async getUser(@Param('id') id: string) {
    return await this.userService.user({ id });
  }

  @Post('users')
  async setUsers(@Body() dataUsers: User[]) {
    return await this.userService.createUsers(dataUsers);
  }

  @Get('client')
  @Render('client')
  getClient(): string {
    return;
  }
}
