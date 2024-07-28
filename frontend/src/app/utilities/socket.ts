"use client";

import { io, Socket } from "socket.io-client";

export function getSocket(sesionToken:string): Socket {
return  io("localhost:3002", {
  auth: {
    token: `bearer ${sesionToken}`,
  },
  extraHeaders: {
    Authorization: `bearer ${sesionToken}`,
  },
});

}
