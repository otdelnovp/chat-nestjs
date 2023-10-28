import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Query } from '@nestjs/common';
import { ChatSearchQuery, ChatService } from './chat.service';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateChatDto } from './dto/create-chat.dto';
import { GetChatDto } from './dto/get-chat.dto';
import { ToggleUserInChatDto } from './dto/toggle-user-in-chat.dto';

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
  @ApiResponse({ status: HttpStatus.OK, type: GetChatDto, isArray: true })
  @Get()
  async getChats(@Query() query: ChatSearchQuery) {
    return await this.chatService.getChats(query);
  }

  ////

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
  @ApiResponse({ status: HttpStatus.OK, type: GetChatDto })
  @Get(':id')
  async getChat(@Param('id') id: string, @Query() query: { userId: string }) {
    return await this.chatService.chat({ id }, query.userId);
  }

  ////

  @ApiOperation({ summary: 'Создание чата' })
  @ApiBody({ type: CreateChatDto })
  @ApiResponse({ status: HttpStatus.CREATED, type: GetChatDto })
  @Post()
  async createChat(@Body() dataChatDto: CreateChatDto) {
    return await this.chatService.createChat(dataChatDto);
  }

  ////

  @ApiOperation({ summary: 'Добавление пользователя в чат' })
  @ApiBody({ type: ToggleUserInChatDto })
  @Put('user-add')
  async addUserToChat(@Body() addUserToChatDto: ToggleUserInChatDto) {
    return await this.chatService.addUserToChat(addUserToChatDto);
  }

  ////

  @ApiOperation({ summary: 'Удаление пользователя из чата' })
  @ApiBody({ type: ToggleUserInChatDto })
  @Delete('user-delete')
  async deleteUserFromChat(@Body() body: ToggleUserInChatDto) {
    return await this.chatService.deleteUserFromChat(body);
  }
}
