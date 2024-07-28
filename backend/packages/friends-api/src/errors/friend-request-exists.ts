import { CustomError } from '@svdw/common';

export class FriendRequestExistsError extends CustomError {
  statusCode = 409;

  constructor() {
    super('Friend request already exists');
  }

  serialiseErrors(): unknown {
    return [{ message: 'Friend request already exists.' }];
  }
}
