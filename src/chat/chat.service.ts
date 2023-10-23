import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Chat, Prisma, User } from '@prisma/client';

export interface ChatCreate extends Chat {
  users: { id: string }[];
}

export interface ChatUserGet extends Pick<User, 'id' | 'name'> {
  lastSeenAt: Date;
}
export interface ChatGet extends Chat {
  users: ChatUserGet[];
}

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

  async createChat(data: ChatCreate): Promise<ChatGet> {
    const { users, ...chat } = data;

    const newChat = await this.prisma.chat.create({
      data: chat,
    });

    const newUsersOnChat: ChatUserGet[] = [];

    for (const userItem of users) {
      await this.prisma.usersOnChats.create({
        data: {
          userId: userItem.id,
          chatId: newChat.id,
          lastSeenAt: newChat.createdAt,
        },
      });

      const currentUser = await this.prisma.user.findUnique({ where: { id: userItem.id } });
      newUsersOnChat.push({
        id: currentUser.id,
        name: currentUser.name,
        lastSeenAt: newChat.createdAt,
      });
    }
    return { ...newChat, users: newUsersOnChat };
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
