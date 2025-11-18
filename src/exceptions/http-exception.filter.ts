import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const err = exception.getResponse() as
      | { message: any; statusCode: number; error: string }
      | { error: string; statusCode: 400; message: string[] }; // class-validator

    if (typeof err !== 'string' && err.statusCode === 400) {
      // class-validator
      return response.status(status).json({
        statusCode: status,
        message: err.message,
        error: 'Validation Error',
      });
    }

    response.status(status).json({
      statusCode: status,
      message: err.message,
      error: err.error,
    });
  }
}
