import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ChatService } from './chat.service';

@Controller('chats')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get()
  async getChats() {
    return await this.chatService.chats({});
  }

  @Get('/:id')
  async getChat(@Param('id') id: string) {
    return await this.chatService.chat({ id });
  }

  @Post()
  async setChats(@Body() dataChat: Prisma.ChatCreateInput) {
    return await this.chatService.createChat(dataChat);
  }
}
