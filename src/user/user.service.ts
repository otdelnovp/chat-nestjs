import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { User, Prisma } from '@prisma/client';

import { DtoTransformService } from 'src/dto-transform/dto-transform.service';
import { CreateUserDto } from './dto/create-user.dto';
import { GetUserDto } from './dto/get-user.dto';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private dtoTransformService: DtoTransformService,
  ) {}

  async user(userWhereUniqueInput: Prisma.UserWhereUniqueInput): Promise<User | null> {
    const foundUser = await this.prisma.user.findUnique({
      where: userWhereUniqueInput,
    });
    return this.dtoTransformService.toClass(foundUser, GetUserDto);
  }

  async users(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<User[]> {
    const { skip, take, cursor, where, orderBy } = params;
    const foundUsers = await this.prisma.user.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
    return this.dtoTransformService.toClassArray(foundUsers, GetUserDto);
  }

  async createUsers(dataUsersDto: CreateUserDto[]): Promise<any> {
    let created = 0;
    let updated = 0;

    const dataUsers: Prisma.UserCreateInput[] = this.dtoTransformService.toClassArray(
      dataUsersDto,
      CreateUserDto,
    );

    try {
      for (const userItem of dataUsers) {
        const isExistUser = await this.prisma.user.findFirst({ where: { id: userItem.id } });
        if (isExistUser) {
          this.updateUser({
            where: { id: userItem.id },
            data: userItem,
          });
          updated++;
        } else {
          this.createUser(userItem);
          created++;
        }
      }
      return { created, updated };
    } catch (error) {
      throw new HttpException('Ошибка добавления пользователей', HttpStatus.BAD_GATEWAY);
    }
  }

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({
      data,
    });
  }

  async updateUser(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }): Promise<User> {
    const { where, data } = params;
    return this.prisma.user.update({
      where,
      data: { ...data, updatedAt: new Date() },
    });
  }

  async deleteUser(where: Prisma.UserWhereUniqueInput): Promise<User> {
    return this.prisma.user.delete({
      where,
    });
  }
}
