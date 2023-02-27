import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { LoggingService } from './logging.service';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new LoggingService();

  use(request: Request, response: Response, next: NextFunction) {
    const { query, body, method, originalUrl } = request;

    response.on('finish', async () => {
      const { statusCode } = response;

      const stringifiedBody = JSON.stringify(body);
      const stringifiedQueryParams = JSON.stringify(query);
      const date = new Date();
      const message = `${date.toLocaleString()} - ${method} - ${originalUrl} - ${statusCode} - body: ${stringifiedBody} - query_params: ${stringifiedQueryParams}`;

      if (statusCode >= 400) {
        await this.logger.error(message);
      }

      await this.logger.log(message);
    });

    next();
  }
}
