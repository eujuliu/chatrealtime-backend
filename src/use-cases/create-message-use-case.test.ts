import { beforeAll, describe, expect, it } from 'vitest';
import { CreateMessageUseCase } from './create-message-use-case';
import { MessagesRepository } from 'repositories/messages-repository';
import { InMemoryMessagesRepository } from 'repositories/In-memory/in-memory-messages-repository';
import { UsersRepository } from 'repositories/users-repository';
import { InMemoryUsersRepository } from 'repositories/In-memory/in-memory-users-repository';
import { CreateUserResponse, CreateUserUseCase } from './create-user-use-case';
import { v4 as uuid } from 'uuid';
import { Message } from 'domain/message';

describe('Create a message (use-case)', () => {
  let messagesRepository: MessagesRepository;
  let usersRepository: UsersRepository;
  let createMessageUseCase: CreateMessageUseCase;
  let createUserUseCase: CreateUserUseCase;
  let user: CreateUserResponse;
  let replyMessage: Message;

  beforeAll(async () => {
    messagesRepository = new InMemoryMessagesRepository();
    usersRepository = new InMemoryUsersRepository();
    createMessageUseCase = new CreateMessageUseCase(
      messagesRepository,
      usersRepository,
    );
    createUserUseCase = new CreateUserUseCase(usersRepository);

    user = (
      await createUserUseCase.execute({
        nickname: 'test123',
        password: 'Password!1',
      })
    ).answer as CreateUserResponse;

    replyMessage = (
      await createMessageUseCase.execute({
        from: user.id as string,
        message: 'Hi',
        reply: null,
        where: uuid(),
      })
    ).answer as Message;
  });

  it('should be able to create a message', async () => {
    const messageOrError = await createMessageUseCase.execute({
      message: 'Hello World!',
      from: user.id,
      reply: null,
      where: uuid(),
    });

    expect(messageOrError.answer).toHaveProperty('id');
  });

  it('should be able to create a message with reply', async () => {
    const messageWithReplyOrError = await createMessageUseCase.execute({
      message: 'Hello!!',
      from: user.id,
      reply: replyMessage.id,
      where: uuid(),
    });

    expect((messageWithReplyOrError.answer as Message).reply).toHaveProperty(
      'id',
    );
  });
});
