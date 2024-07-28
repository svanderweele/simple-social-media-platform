import { CustomError } from '@svdw/common';

export class AccountNotFoundError extends CustomError {
  statusCode = 403;

  constructor() {
    super('Invalid Credentials');
  }

  serialiseErrors(): unknown {
    return undefined;
  }
}
