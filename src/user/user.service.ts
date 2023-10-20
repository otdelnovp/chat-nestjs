import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { User, Prisma } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async user(userWhereUniqueInput: Prisma.UserWhereUniqueInput): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: userWhereUniqueInput,
    });
  }

  async users(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<User[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.user.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async createUsers(dataUsers: Prisma.UserCreateInput[]): Promise<any> {
    let created = 0;
    let updated = 0;
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
