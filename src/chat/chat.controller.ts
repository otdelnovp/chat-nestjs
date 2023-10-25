import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ChatCreate, ChatSearchQuery, ChatService } from './chat.service';

@Controller('chats')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get()
  async getChats(@Query() query: ChatSearchQuery) {
    return await this.chatService.getChats(query);
  }

  @Get(':id')
  async getChat(@Param('id') id: string) {
    return await this.chatService.chat({ id });
  }

  @Post()
  async createChat(@Body() dataChat: ChatCreate) {
    return await this.chatService.createChat(dataChat);
  }

  @Put('user-add')
  async addUserToChat(@Body() body: { chatId: string; userId: string }) {
    return await this.chatService.addUserToChat(body);
  }

  @Delete('user-delete')
  async deleteUserFromChat(@Body() body: { chatId: string; userId: string }) {
    return await this.chatService.deleteUserFromChat(body);
  }
}
