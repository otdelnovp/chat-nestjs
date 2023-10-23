import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ChatCreate, ChatService } from './chat.service';

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
  async createChat(@Body() dataChat: ChatCreate) {
    return await this.chatService.createChat(dataChat);
  }
}
