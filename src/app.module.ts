import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { UserController } from './user/user.controller';
import { ChatController } from './chat/chat.controller';

import { AppService } from './app.service';
import { AppGateway } from './app.gateway';
import { PrismaService } from './prisma.service';

import { UserService } from './user/user.service';
import { ChatService } from './chat/chat.service';

@Module({
  imports: [],
  controllers: [AppController, UserController, ChatController],
  providers: [AppService, AppGateway, PrismaService, UserService, ChatService],
})
export class AppModule {}
