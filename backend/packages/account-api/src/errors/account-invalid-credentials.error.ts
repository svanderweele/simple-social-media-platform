import { CustomError } from '@svdw/common';

export class AccountInvalidCredentialsError extends CustomError {
  statusCode = 403;

  constructor() {
    super('Invalid Credentials');
  }

  serialiseErrors(): unknown {
    return undefined;
  }
}
