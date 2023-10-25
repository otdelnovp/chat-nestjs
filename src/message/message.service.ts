import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Message, Prisma, User } from '@prisma/client';

export interface MessageSearchQuery {
  dateFrom?: Date;
}

export interface MessageCreate extends Message {
  users: { id: string }[];
}

export interface MessageUserGet extends Pick<User, 'id' | 'name'> {
  lastSeenAt: Date;
}
export interface MessageGet extends Message {
  users: MessageUserGet[];
}

export interface MessageSeen {
  chatId: string;
  userId: string;
  lastSeenAt: Date;
}

@Injectable()
export class MessageService {
  constructor(private prisma: PrismaService) {}

  async messages(chatId: string, query: MessageSearchQuery): Promise<Message[]> {
    const { dateFrom } = query;
    return await this.prisma.message.findMany({
      where: { chatId, createdAt: dateFrom },
    });
  }

  async createMessage(data: MessageCreate): Promise<any> {
    return await this.prisma.message.create({
      data,
    });
  }

  async updateMessage(params: {
    where: Prisma.MessageWhereUniqueInput;
    data: Prisma.MessageUpdateInput;
  }): Promise<Message> {
    const { where, data } = params;
    return this.prisma.message.update({
      where,
      data: { ...data, updatedAt: new Date() },
    });
  }

  async seenMessage(params: MessageSeen): Promise<any> {
    const { chatId, userId, lastSeenAt } = params;
    this.prisma.usersOnChats.updateMany({
      where: { chatId, userId },
      data: { lastSeenAt },
    });
    return {
      message: `Последнее прочитанное сообщение в ${new Date(lastSeenAt).toLocaleString('ru')}`,
    };
  }

  async deleteMessage(where: Prisma.MessageWhereUniqueInput): Promise<Message> {
    return this.prisma.message.delete({
      where,
    });
  }
}