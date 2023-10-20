import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Chat, Prisma } from '@prisma/client';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async chat(chatWhereUniqueInput: Prisma.ChatWhereUniqueInput): Promise<Chat | null> {
    return this.prisma.chat.findUnique({
      where: chatWhereUniqueInput,
    });
  }

  async chats(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.ChatWhereUniqueInput;
    where?: Prisma.ChatWhereInput;
    orderBy?: Prisma.ChatOrderByWithRelationInput;
  }): Promise<Chat[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.chat.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async createChat(data: Prisma.ChatCreateInput): Promise<Chat> {
    return this.prisma.chat.create({
      data,
    });
  }

  async updateChat(params: {
    where: Prisma.ChatWhereUniqueInput;
    data: Prisma.ChatUpdateInput;
  }): Promise<Chat> {
    const { where, data } = params;
    return this.prisma.chat.update({
      where,
      data: { ...data, updatedAt: new Date() },
    });
  }

  async deleteChat(where: Prisma.ChatWhereUniqueInput): Promise<Chat> {
    return this.prisma.chat.delete({
      where,
    });
  }
}
