import { Request, NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';
import { getEnvironmentVariable } from '../utils/env-helper';

export interface User {
  id: string;
  username: string;
}

export async function getCurrentUser(token: string): Promise<User> {
  const parsedToken = jwt.verify(token, getEnvironmentVariable('JWT_SECRET'));

  if (typeof parsedToken == 'string') {
    throw new Error('Invalid token');
  }

  const user: User = { username: parsedToken.username, id: parsedToken.id };
  return user;
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      throw new Error('No token provided');
    }
    const user = await getCurrentUser(token.split(' ')[1]);
    req.user = user;
    next();
  } catch (error) {
    res.status(401).send({ message: 'Unauthorized' });
  }
};
