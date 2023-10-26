import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Chat, Prisma, User, UsersOnChats } from '@prisma/client';

export interface ChatSearchQuery {
  parentId?: string;
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
  unread: boolean;
}

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async chat(
    chatWhereUniqueInput: Prisma.ChatWhereUniqueInput,
    userId?: string,
  ): Promise<ChatGet | null> {
    const chat = await this.prisma.chat.findUnique({
      where: chatWhereUniqueInput,
    });

    const usersOnChat = await this.prisma.usersOnChats.findMany({ where: { chatId: chat.id } });
    const getUsersToChat: ChatUserGet[] = [];

    for (const userItem of usersOnChat) {
      const currentUser = await this.prisma.user.findUnique({
        where: { id: userItem.userId },
      });
      getUsersToChat.push({
        id: currentUser.id,
        name: currentUser.name,
        lastSeenAt: userItem.lastSeenAt,
      });
    }

    const activeUser = !!userId && getUsersToChat.find(userItem => userItem.id === userId);
    const unread = !!activeUser && new Date(chat.updatedAt) > new Date(activeUser.lastSeenAt);

    return { ...chat, users: getUsersToChat, unread };
  }

  async chats(chatIds: string[], userId?: string): Promise<ChatGet[]> {
    const finalChats: ChatGet[] = [];
    for (const id of chatIds) {
      const finalChatItem = await this.chat({ id }, userId);
      finalChats.push(finalChatItem);
    }
    return finalChats;
  }

  async getChats(query: ChatSearchQuery): Promise<Chat[]> {
    const { parentId, userId } = query;
    let chatIds: string[] = [];
    if (query.parentId) {
      const chats = await this.prisma.chat.findMany({
        where: { parentId },
      });
      chatIds = chats.map(chatItem => chatItem.id);
    } else if (query.userId) {
      const chats = await this.prisma.usersOnChats.findMany({
        where: { userId },
      });
      chatIds = chats.map(chatItem => chatItem.chatId);
    }
    return this.chats(chatIds, userId);
  }

  async createChat(data: ChatCreate): Promise<any> {
    const { users, ...chat } = data;

    const newChat = await this.prisma.chat.create({
      data: {
        ...chat,
        usersOnChat: {
          create: users.map(user => ({ userId: user.id })),
        },
      },
    });

    return this.chat({ id: newChat.id });
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
    const checkExistUser = await this.prisma.usersOnChats.findFirst({
      where: { chatId, userId },
    });
    if (!checkExistUser) {
      const currentChat = await this.prisma.chat.findUnique({
        where: { id: chatId },
      });
      return await this.prisma.usersOnChats.create({
        data: { chatId, userId, lastSeenAt: currentChat.createdAt },
      });
    } else {
      throw new HttpException('Пользователь уже есть в чате', HttpStatus.CONFLICT);
    }
  }

  async deleteUserFromChat(params: { chatId: string; userId: string }): Promise<any> {
    const { chatId, userId } = params;
    await this.prisma.usersOnChats.deleteMany({
      where: { chatId, userId },
    });
    return {
      message: 'Пользователь успешно удален',
      deleted: { chatId, userId },
    };
  }

  async deleteChat(where: Prisma.ChatWhereUniqueInput): Promise<Chat> {
    return this.prisma.chat.delete({
      where,
    });
  }
}
