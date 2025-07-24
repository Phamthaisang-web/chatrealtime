import { Socket } from "socket.io";

interface CustomSocket extends Socket {
  data: {
    username?: string;
  };
}
