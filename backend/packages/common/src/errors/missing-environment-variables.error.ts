import { CustomError } from './custom-error';

export default class MissingEnvironmentVariablesError extends CustomError {
  statusCode = 500;
  missingKeys: string[];

  constructor(keys: string[]) {
    super(`Missing Environment Variables! ${keys.toString()}`);
    this.missingKeys = keys;
  }

  serialiseErrors(): unknown {
    return {
      message: 'Missing Environment Variables!',
      missingKeys: this.missingKeys,
    };
  }
}
