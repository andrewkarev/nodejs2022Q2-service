import { NestFactory } from '@nestjs/core';
import * as dotenv from 'dotenv';
import { AppModule } from './app.module';
import { PORT } from './common/constants';

async function bootstrap() {
  dotenv.config({ path: '../.env' });
  const app = await NestFactory.create(AppModule);
  await app.listen(PORT);
}

bootstrap();
