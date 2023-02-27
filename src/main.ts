import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
import { cwd } from 'node:process';
import { join } from 'node:path';
import { readFile } from 'fs/promises';
import { parse } from 'yaml';

import { AppModule } from './app.module';
import { LoggingService } from './logging/logging.service';
import { HttpExceptionFilter } from './common/utils/http-exception.filter';
import { createLogsFolder } from './common/helpers/createLogsFolder';

async function bootstrap() {
  dotenv.config({ path: join(cwd(), '.env') });
  const app = await NestFactory.create(AppModule);
  const document = await readFile(join(cwd(), 'doc', 'api.yaml'), 'utf-8');

  app.useLogger(app.get(LoggingService));
  app.useGlobalFilters(new HttpExceptionFilter());

  SwaggerModule.setup('doc', app, parse(document));

  const logError = (message: string) => {
    const logger = new LoggingService();
    logger.error(message);
    process.exit(1);
  };

  process.on('uncaughtException', (error) => {
    logError(`Uncaught ${error.name}: ${error.message}\n${error.stack}`);
  });

  process.on('unhandledRejection', (reason: Error) => {
    logError(`Unhandled promise rejection: ${reason.message}\n${reason.stack}`);
  });

  await createLogsFolder();

  await app.listen(process.env.PORT || 4000);
}

bootstrap();
