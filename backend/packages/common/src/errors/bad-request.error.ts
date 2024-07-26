import { FieldValidationError, ValidationError } from 'express-validator';
import { CustomError } from './custom-error';

export default class BadRequestError extends CustomError {
  statusCode = 400;
  private errors: ValidationError[];

  constructor(errors: ValidationError[]) {
    super('Bad Request');
    this.errors = errors;
  }

  serialiseErrors(): unknown {
    return this.errors.map((x) => {
      const fieldValidationError = x as FieldValidationError;
      if (fieldValidationError) {
        return {
          key: fieldValidationError.path,
          message: fieldValidationError.msg,
        };
      }

      return { key: x.msg, message: x.msg };
    });
  }
}
