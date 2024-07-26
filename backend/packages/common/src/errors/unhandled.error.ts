import { CustomError } from './custom-error';

export class UnhandledError extends CustomError {
  statusCode = 500;
  error: unknown = undefined;
  /**
   *
   */
  constructor(error?: unknown) {
    super('Something went wrong');
    this.error = error;
  }
  serialiseErrors(): unknown {
    return this.error;
  }
}
