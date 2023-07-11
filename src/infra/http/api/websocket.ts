import { io } from 'config/server';

interface message {
  message: string;
}

io.on('connection', (socket) => {
  socket.emit('logging', { message: 'User connected to the server' });

  socket.on('message', ({ message }: message) => {
    console.log(`${socket.id} send: ${message}`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});
