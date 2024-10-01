import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';

@Catch()
export class AppExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(AppExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    let status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let error =
      exception instanceof HttpException
        ? exception.getResponse()
        : { error: 'Internal server error' };

    this.logger.error(status, exception);

    delete error['error'];
    delete error['statusCode'];

    response.status(status).json({
      statusCode: status,
      error: error,
    });
  }
}
