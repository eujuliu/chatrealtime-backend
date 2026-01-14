import { CreateMessageProps } from 'controllers/create-message-controller';
import { InternalServerError, ValidationError } from 'core/errors';
import { createMessageFactory } from 'factories/create-message-factory';
import { authenticateTokenWs } from '../middlewares/auth-ws';
import { io } from 'config/server';

const globalRoomId = '75cbd0df-d756-43a3-a82e-bdbc929e3592';

io.use(authenticateTokenWs).on('connection', (socket) => {
  socket.join(globalRoomId);
  socket.emit('chat_global_id', globalRoomId);

  socket.on('connection', (socket) => {
    console.log('a user connected');
  });

  socket.on(
    'message_send',
    async (
      message: CreateMessageProps,
      acknowledgements: (e: ValidationError | InternalServerError) => void,
    ) => await createMessageFactory().handle(message, io, acknowledgements),
  );

  socket.on('user_typing', (data: { where: string; nickname: string }) => {
    socket.to(data.where).emit('user_typing', { nickname: data.nickname });
  });
});
