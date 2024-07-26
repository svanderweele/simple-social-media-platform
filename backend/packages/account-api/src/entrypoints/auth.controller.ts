import { NextFunction, Request, Response } from 'express';
import * as authService from '../services/auth.service';

export async function register(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { email, password, name } = req.body;
    await authService.register(email, password, name);
    res.status(201).send();
  } catch (error) {
    next(error);
  }
}

export interface LoginResponse {
  sessionToken: string;
}

export async function login(
  req: Request,
  res: Response<LoginResponse>,
  next: NextFunction,
) {
  try {
    const { email, password } = req.body;
    const sessionToken = await authService.login(email, password);
    res.status(200).send({ sessionToken });
  } catch (error) {
    next(error);
  }
}
