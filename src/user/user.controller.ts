import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  ValidationPipe,
} from '@nestjs/common';
import { CreateUserDto, UpdatePasswordDto } from './dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  getUsers() {
    return this.userService.getUsers();
  }

  @Get(':id')
  getUser(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.getUser(id);
  }

  @Post()
  createUser(@Body(ValidationPipe) dto: CreateUserDto) {
    return this.userService.createUser(dto);
  }

  @Put(':id')
  updateUserPassword(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(ValidationPipe) dto: UpdatePasswordDto,
  ) {
    return this.userService.updateUserPassword(id, dto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteUser(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.deleteUser(id);
  }
}
