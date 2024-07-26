import { CustomError } from '@svdw/common';

export class FriendRequestNotFoundError extends CustomError {
  statusCode = 404;

  constructor() {
    super('Friend request not found');
  }

  serialiseErrors(): unknown {
    return [{ message: 'Friend request not found.' }];
  }
}
