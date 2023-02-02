import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto, UpdatePasswordDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { prepareUserResponse } from './helpers/prepareUserResponse';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getUsers() {
    const users = await this.prisma.user.findMany();

    return prepareUserResponse(users);
  }

  async getUser(userId: string) {
    const response = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!response) throw new NotFoundException();

    return prepareUserResponse(response);
  }

  async createUser(dto: CreateUserDto) {
    const user = await this.prisma.user.create({
      data: {
        login: dto.login,
        password: dto.password,
        version: 1,
      },
    });

    return prepareUserResponse(user);
  }

  async updateUserPassword(userId: string, dto: UpdatePasswordDto) {
    const response = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!response) throw new NotFoundException();
    if (response.password !== dto.oldPassword) throw new ForbiddenException();

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: { password: dto.newPassword, version: (response.version += 1) },
    });

    return prepareUserResponse(updatedUser);
  }

  async deleteUser(userId: string) {
    try {
      await this.prisma.user.delete({ where: { id: userId } });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException();
        }
      }
    }
  }
}
