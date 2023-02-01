import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
import { cwd } from 'node:process';
import { join } from 'node:path';
import { readFile } from 'fs/promises';
import { parse } from 'yaml';

import { AppModule } from './app.module';
import { PORT } from './common/constants';

async function bootstrap() {
  dotenv.config({ path: join(process.cwd(), '.env') });
  const app = await NestFactory.create(AppModule);
  const document = await readFile(join(cwd(), 'doc', 'api.yaml'), 'utf-8');

  SwaggerModule.setup('api', app, parse(document));
  await app.listen(PORT);
}

bootstrap();
