import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto, UpdatePasswordDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { prepareUserResponse } from '../common/helpers/prepareUserResponse';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { IUserData } from 'src/common/interfaces/IUserData';
import { PRISMA_ERROR } from 'src/common/constants';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService, private config: ConfigService) {}

  async getUsers(): Promise<IUserData | IUserData[]> {
    const users = await this.prisma.user.findMany();

    return prepareUserResponse(users);
  }

  async getUser(userId: string): Promise<IUserData | IUserData[]> {
    const response = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!response) throw new NotFoundException();

    return prepareUserResponse(response);
  }

  async createUser(dto: CreateUserDto): Promise<IUserData | IUserData[]> {
    const salt = Number(this.config.get('CRYPT_SALT'));
    const hash = await bcrypt.hash(dto.password, salt);
    const user = await this.prisma.user.create({
      data: {
        login: dto.login,
        password: hash,
        hashedRt: '',
        version: 1,
      },
    });

    return prepareUserResponse(user);
  }

  async updateUserPassword(
    userId: string,
    dto: UpdatePasswordDto,
  ): Promise<IUserData | IUserData[]> {
    const response = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!response) throw new NotFoundException();

    const isPasswordMatches = await bcrypt.compare(
      dto.oldPassword,
      response.password,
    );

    if (!isPasswordMatches) throw new ForbiddenException();

    const salt = Number(this.config.get('CRYPT_SALT'));
    const hash = await bcrypt.hash(dto.newPassword, salt);

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: { password: hash, version: (response.version += 1) },
    });

    return prepareUserResponse(updatedUser);
  }

  async deleteUser(userId: string) {
    try {
      await this.prisma.user.delete({ where: { id: userId } });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === PRISMA_ERROR) {
          throw new NotFoundException();
        }
      }
    }
  }
}
