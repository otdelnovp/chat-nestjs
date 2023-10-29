import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Chat, Prisma } from '@prisma/client';

import { DtoTransformService } from 'src/dto-transform/dto-transform.service';
import { GetChatDto } from './dto/get-chat.dto';
import { CreateChatDto } from './dto/create-chat.dto';
import { ToggleUserInChatDto } from './dto/toggle-user-in-chat.dto';

export interface ChatSearchQuery {
  userId: string;
  parentId?: string;
}

@Injectable()
export class ChatService {
  constructor(
    private prisma: PrismaService,
    private dtoTransformService: DtoTransformService,
  ) {}

  async chat(
    chatWhereUniqueInput: Prisma.ChatWhereUniqueInput,
    userId?: string,
  ): Promise<GetChatDto | null> {
    const chat = await this.prisma.chat.findUnique({
      where: chatWhereUniqueInput,
      include: {
        author: { select: { id: true, name: true } },
        usersOnChat: {
          select: { userId: true, user: { select: { id: true, name: true } }, lastSeenAt: true },
        },
      },
    });

    const chatDto = this.dtoTransformService.toClass(chat, GetChatDto);

    const activeUser = !!userId && chatDto.Users.find(userItem => userItem.Id === userId);
    chatDto.Unread = !!activeUser && new Date(chatDto.UpdatedAt) > new Date(activeUser.LastSeenAt);

    return chatDto;
  }

  async chats(chatIds: string[], userId?: string): Promise<GetChatDto[]> {
    const finalChats: GetChatDto[] = [];
    for (const id of chatIds) {
      const finalChatItem = await this.chat({ id }, userId);
      finalChats.push(finalChatItem);
    }
    return finalChats;
  }

  async getChats(query: ChatSearchQuery): Promise<GetChatDto[]> {
    const { parentId, userId } = query;
    let chatIds: string[] = [];
    if (query.userId) {
      const chats = await this.prisma.usersOnChats.findMany({
        where: { userId },
      });
      chatIds = chats.map(chatItem => chatItem.chatId);
    } else if (query.parentId) {
      const chats = await this.prisma.chat.findMany({
        where: { parentId },
      });
      chatIds = chats.map(chatItem => chatItem.id);
    }
    return this.chats(chatIds, userId);
  }

  async createChat(dataChatDto: CreateChatDto): Promise<GetChatDto> {
    const { users, ...chat } = this.dtoTransformService.toClass(dataChatDto, CreateChatDto);

    const newChat = await this.prisma.chat.create({
      data: {
        ...chat,
        usersOnChat: {
          create: users,
        },
      },
    });

    return this.chat({ id: newChat.id }, newChat.authorId);
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

  async addUserToChat(addUserToChatDto: ToggleUserInChatDto): Promise<any> {
    const addUserToChat = this.dtoTransformService.toClass(addUserToChatDto, ToggleUserInChatDto);
    const { chatId, userId } = addUserToChat;
    const checkExistUser = await this.prisma.usersOnChats.findFirst({
      where: { chatId, userId },
    });
    if (!checkExistUser) {
      const currentChat = await this.prisma.chat.findUnique({
        where: { id: chatId },
      });
      await this.prisma.usersOnChats.create({
        data: { chatId, userId, lastSeenAt: currentChat.createdAt },
      });
      return {
        message: 'Пользователь успешно добавлен в чат',
        deleted: { chatId, userId },
      };
    } else {
      throw new HttpException('Пользователь уже есть в чате', HttpStatus.CONFLICT);
    }
  }

  async deleteUserFromChat(deleteUserFromChatDto: ToggleUserInChatDto): Promise<any> {
    const deleteUserFromChat = this.dtoTransformService.toClass(
      deleteUserFromChatDto,
      ToggleUserInChatDto,
    );
    const { chatId, userId } = deleteUserFromChat;
    await this.prisma.usersOnChats.deleteMany({
      where: { chatId, userId },
    });
    return {
      message: 'Пользователь успешно удален из чата',
      deleted: { chatId, userId },
    };
  }

  async deleteChat(where: Prisma.ChatWhereUniqueInput): Promise<any> {
    const deletedChat = await this.prisma.chat.delete({
      where,
    });
    return {
      message: `Чат "${deletedChat.name}" успешно удален`,
    };
  }
}
