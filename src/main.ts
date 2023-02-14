import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
import { cwd } from 'node:process';
import { join } from 'node:path';
import { readFile } from 'fs/promises';
import { parse } from 'yaml';

import { AppModule } from './app.module';

async function bootstrap() {
  dotenv.config({ path: join(process.cwd(), '.env') });
  const app = await NestFactory.create(AppModule);
  const document = await readFile(join(cwd(), 'doc', 'api.yaml'), 'utf-8');

  SwaggerModule.setup('doc', app, parse(document));
  await app.listen(process.env.PORT || 4000);
}

bootstrap();
