import { CustomError } from '@svdw/common';

export class FriendMappingExistsError extends CustomError {
  statusCode = 409;

  constructor() {
    super('Friend Mapping already exists');
  }

  serialiseErrors(): unknown {
    return undefined;
  }
}
