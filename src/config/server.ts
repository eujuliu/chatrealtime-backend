import cors from 'cors';
import express from 'express';
import { Server } from 'socket.io';
import { createServer } from 'http';
import { routes } from 'infra/app/api/v1';
import 'infra/mongodb';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});
app.use(
  cors({
    origin: '*',
  }),
);
app.use(express.json());
app.use(routes);

export { server, io };
