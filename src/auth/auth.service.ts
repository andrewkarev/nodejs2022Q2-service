import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as argon from 'argon2';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDTO } from './dto';
import { Tokens } from './types';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
    private jwtService: JwtService,
  ) {}

  async hashData(data: string) {
    const salt = Number(this.config.get('CRYPT_SALT'));

    return bcrypt.hash(data, salt);
  }

  async getTokens(userId: string, login: string) {
    const accessToken = await this.jwtService.signAsync(
      { userId, login },
      {
        expiresIn: this.config.get('TOKEN_EXPIRE_TIME'),
        secret: this.config.get('JWT_SECRET_KEY'),
      },
    );

    const refreshToken = await this.jwtService.signAsync(
      { userId, login },
      {
        expiresIn: this.config.get('TOKEN_REFRESH_EXPIRE_TIME'),
        secret: this.config.get('JWT_SECRET_REFRESH_KEY'),
      },
    );

    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }

  async updateRtHash(userId: string, refreshToken: string) {
    const hash = await argon.hash(refreshToken);

    await this.prisma.user.update({
      where: { id: userId },
      data: { hashedRt: hash },
    });
  }

  async prepareResponse(userId: string, login: string) {
    const tokens = await this.getTokens(userId, login);

    await this.updateRtHash(userId, tokens.refreshToken);

    return tokens;
  }

  async signup(dto: AuthDTO) {
    const hash = await this.hashData(dto.password);

    const user = await this.prisma.user.create({
      data: {
        login: dto.login,
        password: hash,
        hashedRt: '',
        version: 1,
      },
    });

    await this.prepareResponse(user.id, user.login);

    return;
  }

  async login(dto: AuthDTO): Promise<Tokens> {
    const user = await this.prisma.user.findFirst({
      where: { login: dto.login },
    });

    if (!user) throw new ForbiddenException();

    const isPasswordMatches = await bcrypt.compare(dto.password, user.password);

    if (!isPasswordMatches) throw new ForbiddenException();

    return await this.prepareResponse(user.id, user.login);
  }

  async refreshTokens(refreshToken: string) {
    try {
      const { userId } = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.config.get('JWT_SECRET_REFRESH_KEY'),
      });

      const user = await this.prisma.user.findUnique({ where: { id: userId } });

      if (!user || !user.hashedRt) throw new ForbiddenException();

      const refreshTokenMatches = await argon.verify(
        user.hashedRt,
        refreshToken,
      );

      if (!refreshTokenMatches) throw new ForbiddenException();

      return await this.prepareResponse(user.id, user.login);
    } catch (error) {
      throw new ForbiddenException();
    }
  }
}
