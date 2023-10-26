import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ChatCreate, ChatSearchQuery, ChatService } from './chat.service';
import { ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('Чаты (chats)')
@Controller('chats')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @ApiOperation({ summary: 'Получить список чатов' })
  @ApiQuery({
    name: 'userId',
    description: 'UUID пользователя который запрашивает чаты',
    example: '2023-10-25T14:20:10.539Z',
  })
  @ApiQuery({
    name: 'parentId',
    description: 'UUID родительской сущности для которой запрашиваются чаты',
    example: '2023-10-25T14:20:10.539Z',
    required: false,
  })
  @Get()
  async getChats(@Query() query: ChatSearchQuery) {
    return await this.chatService.getChats(query);
  }

  @ApiOperation({ summary: 'Получить данные одного чата' })
  @ApiParam({
    name: 'id',
    description: 'UUID чата',
    example: '82879df6-7bfc-11e6-80d5-10604ba8b340',
  })
  @ApiQuery({
    name: 'userId',
    description: 'UUID пользователя который запрашивает чат',
    example: '2023-10-25T14:20:10.539Z',
  })
  @Get(':id')
  async getChat(@Param('id') id: string, @Query() query: { userId: string }) {
    return await this.chatService.chat({ id }, query.userId);
  }

  @ApiOperation({ summary: 'Создание чата' })
  @Post()
  async createChat(@Body() dataChat: ChatCreate) {
    return await this.chatService.createChat(dataChat);
  }

  @ApiOperation({ summary: 'Добавление пользователя в чат' })
  @Put('user-add')
  async addUserToChat(@Body() body: { chatId: string; userId: string }) {
    return await this.chatService.addUserToChat(body);
  }

  @ApiOperation({ summary: 'Удаление пользователя из чата' })
  @Delete('user-delete')
  async deleteUserFromChat(@Body() body: { chatId: string; userId: string }) {
    return await this.chatService.deleteUserFromChat(body);
  }
}
