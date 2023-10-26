import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { MessageCreate, MessageSearchQuery, MessageSeen, MessageService } from './message.service';
import { ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';

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
  @Get(':chatId')
  async getMessages(@Param('chatId') chatId: string, @Query() query: MessageSearchQuery) {
    return await this.messageService.messages(chatId, query);
  }

  @ApiOperation({ summary: 'Добавление пользователя в чат' })
  @Post()
  async createMessage(@Body() dataMessage: MessageCreate) {
    return await this.messageService.createMessage(dataMessage);
  }

  @ApiOperation({
    summary: 'Сделать отметку о времени последнего прочитанного пользователем сообщения',
  })
  @Put('last-seen')
  async seenMessage(@Body() body: MessageSeen) {
    return await this.messageService.seenMessage(body);
  }
}
