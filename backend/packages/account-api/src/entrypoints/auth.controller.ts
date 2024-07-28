import { NextFunction, Request, Response } from 'express';
import * as authService from '../services/auth.service';
import { User } from '../entities/user.entity';

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
  accountId: string;
  userId: string;
}

export async function login(
  req: Request,
  res: Response<LoginResponse>,
  next: NextFunction,
) {
  try {
    const { email, password } = req.body;
    const { sessionToken, accountId, userId } = await authService.login(
      email,
      password,
    );
    res.status(200).send({ sessionToken, accountId, userId });
  } catch (error) {
    next(error);
  }
}

export interface UserDto {
  id: string;
  name: string;
  email: string;
  accountId: string;
}

export async function getUsers(
  req: Request,
  res: Response<UserDto[]>,
  next: NextFunction,
) {
  try {
    const users = await authService.getUsers();
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
}
