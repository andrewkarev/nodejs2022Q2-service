import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { v4 as uuid4 } from 'uuid';
import { DBService } from 'src/db/db.service';
import { CreateUserDto, UpdatePasswordDto } from './dto';
import { extractPassword } from './helpers/extractPassword';
import { DbMessages } from 'src/common/DbMessages';

@Injectable()
export class UserService {
  constructor(private db: DBService) {}

  async getUsers() {
    const users = await this.db.getUsers();

    return users.length ? extractPassword(users) : users;
  }

  async getUser(userId: string) {
    const response = await this.db.getUser(userId);

    if (!response) throw new NotFoundException();

    return extractPassword(response);
  }

  async createUser(dto: CreateUserDto) {
    const newUser = {
      id: uuid4(),
      login: dto.login,
      password: dto.password,
      version: 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    const user = await this.db.createUser(newUser);

    return extractPassword(user);
  }

  async updateUserPassword(userId: string, dto: UpdatePasswordDto) {
    const response = await this.db.updateUserPassword(userId, dto);

    if (response === DbMessages.NOT_FOUND) throw new NotFoundException();
    if (response === DbMessages.FORBIDDEN) throw new ForbiddenException();

    return extractPassword(response);
  }

  async deleteUser(userId: string) {
    const response = await this.db.deleteUser(userId);

    if (response === DbMessages.NOT_FOUND) throw new NotFoundException();
  }
}
