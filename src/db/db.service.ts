import { Injectable } from '@nestjs/common';
import { User } from 'src/user/interfaces/user.interface';

@Injectable()
export class DBService {
  private users: User[] = [];
}
