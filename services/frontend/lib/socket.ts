import { io, Socket } from "socket.io-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    socket = io(API_URL, { transports: ["websocket"] });
  }
  return socket;
}

export function joinDeployRoom(deployId: string) {
  getSocket().emit("join-deploy", { deployId });
}

export function onDeployLog(cb: (log: string) => void) {
  getSocket().on("deploy:log", cb);
  return () => getSocket().off("deploy:log", cb);
}

export function onDeployStatus(cb: (data: { deployId: string; status: string }) => void) {
  getSocket().on("deploy:status", cb);
  return () => getSocket().off("deploy:status", cb);
}

export function disconnectSocket() {
  socket?.disconnect();
  socket = null;
}
