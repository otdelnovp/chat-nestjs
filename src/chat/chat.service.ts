import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Chat, Prisma, User, UsersOnChats } from '@prisma/client';

export interface ChatSearchQuery {
  parentId: string;
  userId: string;
}

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

  async chat(chatWhereUniqueInput: Prisma.ChatWhereUniqueInput): Promise<ChatGet | null> {
    const chat = await this.prisma.chat.findUnique({
      where: chatWhereUniqueInput,
    });

    const usersOnChat = await this.prisma.usersOnChats.findMany({ where: { chatId: chat.id } });
    const getUsersToChat: ChatUserGet[] = [];

    for (const userItem of usersOnChat) {
      const currentUser = await this.prisma.user.findUnique({
        where: { id: userItem.id },
      });
      getUsersToChat.push({
        id: currentUser.id,
        name: currentUser.name,
        lastSeenAt: userItem.lastSeenAt,
      });
    }

    return { ...chat, users: getUsersToChat };
  }

  async getChats(query: ChatSearchQuery): Promise<Chat[]> {
    const { parentId, userId } = query;
    if (query.parentId) {
      return await this.chats(parentId);
    } else if (query.userId) {
      return await this.chatsOfUserId(userId);
    }
  }

  async chats(parentId: string): Promise<ChatGet[]> {
    const chats = await this.prisma.chat.findMany({
      where: { parentId },
    });
    const finalChats: ChatGet[] = [];
    for (const chatItem of chats) {
      const finalChatItem = await this.chat({ id: chatItem.id });
      finalChats.push(finalChatItem);
    }
    return finalChats;
  }

  async chatsOfUserId(userId: string): Promise<ChatGet[]> {
    const chatsOfUser = await this.prisma.usersOnChats.findMany({
      where: { userId },
    });
    const finalChats: ChatGet[] = [];
    for (const chatItem of chatsOfUser) {
      const finalChatItem = await this.chat({ id: chatItem.id });
      finalChats.push(finalChatItem);
    }
    return finalChats;
  }

  async createChat(data: ChatCreate): Promise<any> {
    const { users, ...chat } = data;

    await this.prisma.chat.create({
      data: {
        ...chat,
        UsersOnChats: {
          create: users.map(user => ({ userId: user.id })),
        },
      },
    });

    return { message: 'Чат создан', code: HttpStatus.CREATED };
    // return this.chat({ id: newChat.id });
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

  async addUserToChat(params: { chatId: string; userId: string }): Promise<UsersOnChats> {
    const { chatId, userId } = params;
    const currentChat = await this.prisma.chat.findUnique({
      where: { id: chatId },
    });
    return await this.prisma.usersOnChats.create({
      data: { chatId, userId, lastSeenAt: currentChat.createdAt },
    });
  }

  async deleteUserFromChat(params: { chatId: string; userId: string }): Promise<any> {
    const { chatId, userId } = params;
    await this.prisma.usersOnChats.deleteMany({
      where: { chatId, userId },
    });
    return { deleted: { chatId, userId } };
  }

  async deleteChat(where: Prisma.ChatWhereUniqueInput): Promise<Chat> {
    return this.prisma.chat.delete({
      where,
    });
  }
}
