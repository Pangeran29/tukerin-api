import { InternalServerErrorException, Logger } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

export class PrismaException extends InternalServerErrorException {
  private readonly logger = new Logger(PrismaException.name);

  constructor(error?: PrismaClientKnownRequestError) {
    let msg: any = 'Fail to do DB operation';

    if (error.code === 'P2002') {
      const scope = error?.meta?.target;
      msg = `Unique constraint exception at field ${scope}.`;
    }

    if (error.code === 'P2003') {
      let field = '-';
      if (error?.meta?.field_name) {
        const error_array = (error?.meta?.field_name as string).split('_');
        field = error_array.slice(1, error_array.length - 1).join(' ');
      }
      msg = `Record '${field}' not found.`;
    }

    if (error.code === 'P2025') {
      msg = `Fail to connect to some record. Please check the id and make sure the record exist.`;
    }

    msg = 'Fail to do DB operation';

    super({ message: msg, dbError: error.message || error });
    this.logger.error(error);
  }
}
