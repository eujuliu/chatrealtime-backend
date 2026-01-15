import cors from 'cors';
import express from 'express';
import { Server } from 'socket.io';
import { createServer } from 'http';
import { routes } from 'app/api/v1';
import path, { dirname } from 'path';

import 'infra/mongodb';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
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
app.use(express.static(path.join(__dirname, '../../static/')));
app.use(express.json());
app.use(routes);
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../../static/index.html'));
});


export { server, io };
