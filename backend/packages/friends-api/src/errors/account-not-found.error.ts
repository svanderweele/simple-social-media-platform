import { CustomError } from '@svdw/common';

export class AccountNotFoundError extends CustomError {
  statusCode = 403;

  constructor() {
    super('Account not found');
  }

  serialiseErrors(): unknown {
    return undefined;
  }
}
