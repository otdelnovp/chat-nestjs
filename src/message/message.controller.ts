import { Body, Controller, Get, HttpStatus, Param, Post, Put, Query } from '@nestjs/common';
import { MessageSearchQuery, MessageService } from './message.service';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

import { GetMessageDto } from './dto/get-message.dto';
import { CreateMessageDto } from './dto/create-message.dto';
import { SeenMessageDto } from './dto/seen-message.dto';

@ApiTags('Сообщения (messages)')
@Controller('messages')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @ApiOperation({ summary: 'Получение списка сообщений' })
  @ApiParam({
    name: 'chatId',
    description: 'UUID чата',
    example: '82879df6-7bfc-11e6-80d5-10604ba8b340',
  })
  @ApiQuery({
    name: 'dateFrom',
    description: 'Время начиная с которого нужно отобрать сообщения',
    example: '2023-10-25T14:20:10.539Z',
    required: false,
  })
  @ApiResponse({ status: HttpStatus.OK, type: GetMessageDto, isArray: true })
  @Get(':chatId')
  async getMessages(@Param('chatId') chatId: string, @Query() query: MessageSearchQuery) {
    return await this.messageService.messages(chatId, query);
  }

  ////

  @ApiOperation({ summary: 'Добавление сообщения' })
  @ApiBody({ type: CreateMessageDto })
  @ApiResponse({ status: HttpStatus.CREATED, type: GetMessageDto })
  @Post()
  async createMessage(@Body() dataMessageDto: CreateMessageDto) {
    return await this.messageService.createMessage(dataMessageDto);
  }

  ////

  @ApiOperation({
    summary: 'Сделать отметку о времени последнего прочитанного пользователем сообщения',
  })
  @ApiBody({ type: SeenMessageDto })
  @Put('last-seen')
  async seenMessage(@Body() dataSeenMessageDto: SeenMessageDto) {
    return await this.messageService.seenMessage(dataSeenMessageDto);
  }
}
