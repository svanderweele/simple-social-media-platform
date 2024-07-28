import { getCurrentUser } from '@svdw/common';
import { NextFunction, Request, Response } from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';

let allSockets: Socket[] = [];
const socketCache: Record<string, Socket[]> = {};

export function getSockets(accountId?: string): Socket[] {
  if (accountId) {
    return socketCache[accountId];
  }

  return allSockets;
}

export const httpAuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      throw new Error('No token provided');
    }
    req.user = await getCurrentUser(token.split(' ')[1]);
    next();
  } catch (error) {
    next(error);
  }
};

export const socketAuthMiddleware = async (
  socket: Socket,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  next: (error?: any) => void,
): Promise<void> => {
  try {
    const token = socket.handshake.auth.token;
    if (!token) {
      throw new Error('No token provided');
    }
    const user = await getCurrentUser(token.split(' ')[1]);

    if (!user) {
      throw new Error('Invalid Token');
    }

    next();
  } catch (error) {
    next(error);
  }
};

export async function initialiseSockets(server: http.Server) {
  try {
    const socketServer = new Server(server, {
      cors: {
        origin: '*',
        allowedHeaders: '*',
      },
    });

    socketServer.use(socketAuthMiddleware);
    socketServer.engine.use(httpAuthMiddleware);

    socketServer.on('connection', onUserConnected);
    socketServer.on('disconnect', onUserDisconnected);
  } catch (err) {
    console.error(err);
  }
}

function onUserConnected(socket: Socket) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  const account = socket.request.user;

  if (!socketCache[account.id]) {
    socketCache[account.id] = [];
  }

  socketCache[account.id].push(socket);
  allSockets.push(socket);
  //TODO: Store socket in Redis cache
}

function onUserDisconnected(socket: Socket) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  const account = socket.request.user;
  socketCache[account.id] = socketCache[account.id].filter(
    (x) => x.id !== socket.id,
  );

  allSockets = allSockets.filter((x) => x.id == socket.id);
}
