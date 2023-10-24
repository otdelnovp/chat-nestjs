import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { UserController } from './user/user.controller';
import { ChatController } from './chat/chat.controller';
import { MessageController } from './message/message.controller';

import { AppService } from './app.service';
import { AppGateway } from './app.gateway';
import { PrismaService } from './prisma.service';

import { UserService } from './user/user.service';
import { ChatService } from './chat/chat.service';
import { MessageService } from './message/message.service';

@Module({
  imports: [],
  controllers: [AppController, UserController, ChatController, MessageController],
  providers: [AppService, AppGateway, PrismaService, UserService, ChatService, MessageService],
})
export class AppModule {}
