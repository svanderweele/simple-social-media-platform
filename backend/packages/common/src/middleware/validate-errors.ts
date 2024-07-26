import { NextFunction, Response, Request } from 'express';
import { validationResult } from 'express-validator';
import BadRequestError from '../errors/bad-request.error';

export const validateErrors = (
  req: Request,
  _response: Response,
  next: NextFunction,
) => {
  const result = validationResult(req);
  if (result.isEmpty() === false) {
    throw new BadRequestError(result.array());
  }

  return next();
};
