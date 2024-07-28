import { Response } from 'express';
import { getLogger } from '../utils/logger';
import { CustomError } from './custom-error';

class ErrorHandler {
  public async handleError(err: Error, res: Response | null): Promise<void> {
    //TODO : error metric
    getLogger().error(err);

    if (res) {
      if (err instanceof CustomError) {
        res.status(err.statusCode).send({
          message: err.message,
          errors: err.serialiseErrors(),
          status: err.statusCode,
        });
      } else {
        res.status(500).send({
          message: 'Unexpected error occurred',
          status: 500,
        });
      }
    }
  }
}

export const handler = new ErrorHandler();
