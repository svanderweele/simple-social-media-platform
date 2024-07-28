import { NextFunction, Request, Response } from 'express';
import { handler } from '../errors/error-handler';

export interface CustomErrorResponse {
  message: string;
  errors: unknown;
  status: number;
}

export const globalErrorHandler = async (
  err: Error,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
): Promise<void> => {
  await handler.handleError(err, res);

  // Try stop here
  // _next(err);
};
