import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ChatCreate, ChatSearchQuery, ChatService } from './chat.service';

@Controller('chats')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get()
  async getChats(@Query() query: ChatSearchQuery) {
    return await this.chatService.getChats(query);
  }

  @Get('/:id')
  async getChat(@Param('id') id: string) {
    return await this.chatService.chat({ id });
  }

  @Post()
  async createChat(@Body() dataChat: ChatCreate) {
    return await this.chatService.createChat(dataChat);
  }

  @Put('/:id')
  async addUserToChat(@Param('id') chatId: string, @Body() body: { userId: string }) {
    return await this.chatService.addUserToChat({ chatId, userId: body.userId });
  }

  @Delete('/:id')
  async deleteUserFromChat(@Param('id') chatId: string, @Body() body: { userId: string }) {
    return await this.chatService.deleteUserFromChat({ chatId, userId: body.userId });
  }
}
