import { io } from 'config/server';

interface Message {
  id: string;
  message: string;
  sender: string;
  where: string;
  reply: string | null;
}

const messages: Message[] = [];
io.on('connection', (socket) => {
  socket.on('connect_room', ({ room }: { nickname: string; room: string }) => {
    socket.join(room);

    console.log(room);
  });

  socket.on('message', (message: Message) => {
    messages.push(message);

    console.log(message);
    io.to(message.where).emit('message', message);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});
