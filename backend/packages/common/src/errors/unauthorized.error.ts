import { CustomError } from './custom-error';

export class UnAuthorizedError extends CustomError {
  statusCode = 403;

  serialiseErrors(): unknown {
    return undefined;
  }
}
