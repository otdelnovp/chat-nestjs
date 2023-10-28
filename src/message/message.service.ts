import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Message, Prisma } from '@prisma/client';

import { DtoTransformService } from 'src/dto-transform/dto-transform.service';
import { GetMessageDto } from './dto/get-message.dto';
import { CreateMessageDto } from './dto/create-message.dto';
import { SeenMessageDto } from './dto/seen-message.dto';

export interface MessageSearchQuery {
  dateFrom?: Date;
}

@Injectable()
export class MessageService {
  constructor(
    private prisma: PrismaService,
    private dtoTransformService: DtoTransformService,
  ) {}

  async messages(chatId: string, query: MessageSearchQuery): Promise<GetMessageDto[]> {
    const { dateFrom } = query;
    const messages = await this.prisma.message.findMany({
      where: { chatId, createdAt: { gte: dateFrom } },
      include: { author: { select: { id: true, name: true } } },
    });
    return this.dtoTransformService.toClassArray(messages, GetMessageDto);
  }

  async createMessage(dataMessageDto: CreateMessageDto): Promise<GetMessageDto> {
    const dataMessage = this.dtoTransformService.toClass(dataMessageDto, CreateMessageDto);
    const { chatId, authorId } = dataMessage;
    const now = new Date();

    await this.prisma.usersOnChats.updateMany({
      where: { chatId, userId: authorId },
      data: { lastSeenAt: now },
    });

    await this.prisma.chat.update({
      where: { id: chatId },
      data: { updatedAt: now },
    });

    const newMessage = await this.prisma.message.create({
      data: dataMessage,
      include: { author: { select: { id: true, name: true } } },
    });

    return this.dtoTransformService.toClass(newMessage, GetMessageDto);
  }

  async updateMessage(params: {
    where: Prisma.MessageWhereUniqueInput;
    data: Prisma.MessageUpdateInput;
  }): Promise<Message> {
    const { where, data } = params;
    return await this.prisma.message.update({
      where,
      data: { ...data, updatedAt: new Date() },
    });
  }

  async seenMessage(dataSeenMessageDto: SeenMessageDto): Promise<any> {
    const dataSeenMessage = this.dtoTransformService.toClass(dataSeenMessageDto, SeenMessageDto);
    const { chatId, userId, lastSeenAt } = dataSeenMessage;
    await this.prisma.usersOnChats.updateMany({
      where: { chatId, userId },
      data: { lastSeenAt },
    });
    return {
      message: `Последнее прочитанное сообщение в ${new Date(lastSeenAt).toLocaleString('ru')}`,
    };
  }

  async deleteMessage(where: Prisma.MessageWhereUniqueInput): Promise<Message> {
    return await this.prisma.message.delete({
      where,
    });
  }
}
