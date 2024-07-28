import { CustomError } from '@svdw/common';

export class AccountExistsError extends CustomError {
  statusCode = 400;

  constructor() {
    super('Account already exists');
  }

  serialiseErrors(): unknown {
    return undefined;
  }
}
