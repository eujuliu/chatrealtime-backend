import { io } from 'config/server';
import { CreateMessageRequest } from 'use-cases/create-message-use-case';

io.use((socket, next) => {
  if (socket.handshake.auth && socket.handshake.auth.token) {
    const token: string = socket.handshake.auth.token;

    console.log(token);

    next();
  } else {
    next(new Error('Error'));
  }
}).on('connection', (socket) => {
  socket.on('connect_room', ({ room }: { nickname: string; room: string }) => {
    socket.join(room);
  });

  socket.on('message', (message: CreateMessageRequest) => {
    console.log(message);

    io.to(message.where).emit('message', message);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});
