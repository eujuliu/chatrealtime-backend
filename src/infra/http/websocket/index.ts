import { io } from 'config/server';
import { CreateMessageProps } from 'controllers/create-message-controller';
import { InternalServerError, ValidationError } from 'core/errors';
import { createMessageFactory } from 'factories/create-message-factory';

const globalRoomId = '75cbd0df-d756-43a3-a82e-bdbc929e3592';

io.on('connection', (socket) => {
  socket.join(globalRoomId);
  socket.emit('chat_global_id', globalRoomId);

  socket.on(
    'message_send',
    async (
      message: CreateMessageProps,
      acknowledgements: (e: ValidationError | InternalServerError) => void,
    ) => {
      await createMessageFactory().handle(message, io, acknowledgements);
    },
  );
});
