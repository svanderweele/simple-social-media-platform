import { CustomError } from '@svdw/common';

export class InvalidFriendRequest extends CustomError {
  statusCode = 400;
  message = '';

  constructor(message: string) {
    super(message);
    this.message = message;
  }

  serialiseErrors(): unknown {
    return [{ message: this.message }];
  }
}
