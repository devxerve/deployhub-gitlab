import { io, Socket } from "socket.io-client";

import { API_URL } from "@/lib/config";

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    // API_URL points at a same-origin path (e.g. https://localhost/api/backend)
    // proxied through Traefik to the NestJS backend. socket.io-client treats
    // any path in the connection URL as a namespace, not an HTTP path, so we
    // must connect to the bare origin and pass the real path explicitly —
    // Traefik strips the "/api/backend" prefix before it reaches the backend,
    // where the gateway listens on the default "/socket.io" path.
    const url = new URL(API_URL);
    socket = io(url.origin, {
      path: `${url.pathname.replace(/\/$/, "")}/socket.io`,
      transports: ["websocket"],
    });
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
