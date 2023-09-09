import { Server as HttpServer } from 'http';
import { AddressInfo } from 'net';
import { Server, Socket as SocketBack } from 'socket.io';
import Client, { Socket as SocketClient } from 'socket.io-client';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { CreateMessageProps } from './create-message-controller';
import { InternalServerError, ValidationError } from 'core/errors';
import { createMessageFactory } from 'factories/create-message-factory';
import { server } from 'config/server';
import { PrismaClient } from '@prisma/client';
import { uuidToBinary } from 'utils/uuid-to-binary';
import { v4 as uuid } from 'uuid';

const where = uuid();
const prisma = new PrismaClient();
let io: Server;
let socketBack: SocketBack;
let socketFront: SocketClient;
let httpServer: HttpServer;

beforeAll(async () => {
  httpServer = server;
  io = new Server(httpServer);

  await new Promise<void>((resolve) => {
    httpServer.listen(() => {
      const { port } = httpServer.address() as AddressInfo;

      socketFront = Client(`http://localhost:${port}`);

      io.on('connection', (socket) => {
        socket.join(where);
        socketBack = socket;
      });

      socketFront.on('connect', () => {
        resolve();
      });
    });
  });
});

afterAll(() => {
  io.close();
  socketFront.close();
  httpServer.close();
});

describe('POST wss:message_send', () => {
  it('should be able to create a message', async () => {
    await prisma.user.create({
      data: {
        id: uuidToBinary('0b35b1b9-e239-4404-a860-6f12d0d52882'),
        nickname: 'test123',
        password: 'Test12345678!',
        createdAt: '',
        updatedAt: '',
      },
    });

    socketFront.emit('message_send', {
      message: 'Test',
      from: '0b35b1b9-e239-4404-a860-6f12d0d52882',
      where,
      reply: null,
    });

    socketBack.on(
      'message_send',
      async (
        message: CreateMessageProps,
        acknowledgements: (e: ValidationError | InternalServerError) => void,
      ) => {
        await createMessageFactory().handle(message, io, acknowledgements);
      },
    );

    const response = await new Promise((resolve) => {
      socketFront.on('message_created', (message) => resolve(message));
    });

    expect(response).toHaveProperty('id');
  });
});
