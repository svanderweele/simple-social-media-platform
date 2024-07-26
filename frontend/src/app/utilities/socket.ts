"use client";

import { io } from "socket.io-client";

export let SESSION_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImF3ZXNvbWUudGhvbWFzQGdtYWlsLmNvbSIsImlkIjoiNWI5OTE5ZDYtYjRlNC00ZGRmLTg0YWItNGVhNzg4MWMyYzg3IiwiaWF0IjoxNzIyMDAwOTcyLCJleHAiOjE3MjIwODczNzJ9.t3kCI9iOax8TriBqrKD63WRlpvJ168w7C4Dq3RaMU3M";

SESSION_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImF3ZXNvbWUudGhvbWFzKzFAZ21haWwuY29tIiwiaWQiOiJhMmZiMjQ4ZC1mNzI1LTQ0YzAtYWVjMi1lNGNjM2E5YTRiNWYiLCJpYXQiOjE3MjIwMDI0MTAsImV4cCI6MTcyMjA4ODgxMH0.jinp2OPkFXs01mxlx3m24HM9ZdAroC4kfLa81LvggrI";

export const socket = io("localhost:3002", {
  auth: {
    token: `bearer ${SESSION_TOKEN}`,
  },
  extraHeaders: {
    Authorization: `bearer ${SESSION_TOKEN}`,
  },
});
