import cors from 'cors';
import express from 'express';
import { Server } from 'socket.io';
import { createServer } from 'http';
import { routes } from 'infra/http/api/v1';
import cookieParser from 'cookie-parser';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(routes);

export { server, io };
