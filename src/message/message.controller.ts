import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { MessageCreate, MessageSearchQuery, MessageSeen, MessageService } from './message.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Сообщения (messages)')
@Controller('messages')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Get(':id')
  async getMessages(@Param('id') chatId: string, @Query() query: MessageSearchQuery) {
    return await this.messageService.messages(chatId, query);
  }

  @Post()
  async createMessage(@Body() dataMessage: MessageCreate) {
    return await this.messageService.createMessage(dataMessage);
  }

  @Put('last-seen')
  async seenMessage(@Body() body: MessageSeen) {
    return await this.messageService.seenMessage(body);
  }
}
