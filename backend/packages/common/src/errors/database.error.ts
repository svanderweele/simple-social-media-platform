import { CustomError } from './custom-error';

export class DatabaseError extends CustomError {
  statusCode = 500;

  error: unknown;

  constructor(error: unknown) {
    super();
    this.error = error;
  }

  serialiseErrors(): unknown {
    return [{ message: 'Database error', error: this.error }];
  }
}
