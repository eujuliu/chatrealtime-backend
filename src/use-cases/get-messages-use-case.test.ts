import { MessagesRepository } from 'repositories/messages-repository';
import { UsersRepository } from 'repositories/users-repository';
import { beforeAll, describe, expect, it } from 'vitest';
import { CreateMessageUseCase } from './create-message-use-case';
import { GetMessagesUseCase } from './get-messages-use-case';
import { InMemoryMessagesRepository } from 'repositories/In-memory/in-memory-messages-repository';
import { InMemoryUsersRepository } from 'repositories/In-memory/in-memory-users-repository';
import { v4 as uuid } from 'uuid';
import { CreateUserResponse, CreateUserUseCase } from './create-user-use-case';
import { Message } from 'core/domain/message';

describe('Get messages (use-case)', async () => {
  const where = uuid();
  let messagesRepository: MessagesRepository;
  let usersRepository: UsersRepository;
  let createMessageUseCase: CreateMessageUseCase;
  let getMessagesUseCase: GetMessagesUseCase;
  let createUserUseCase: CreateUserUseCase;

  const messages = [
    'Hello!',
    'Welcome to our chat.',
    'How are you?',
    "What's your favorite hobby?",
    'Have you seen any good movies lately?',
    "What's your favorite book?",
    'Tell me a fun fact.',
    'Do you have any pets?',
    "How's the weather where you are?",
    "What's your favorite food?",
    "What's the best place you've ever visited?",
    'Any exciting plans for the weekend?',
    "What's your favorite color?",
    'Do you play any musical instruments?',
    'Tell me about your dream job.',
  ];

  beforeAll(async () => {
    messagesRepository = new InMemoryMessagesRepository();
    usersRepository = new InMemoryUsersRepository();
    createMessageUseCase = new CreateMessageUseCase(
      messagesRepository,
      usersRepository,
    );
    getMessagesUseCase = new GetMessagesUseCase(messagesRepository);
    createUserUseCase = new CreateUserUseCase(usersRepository);

    const user = await createUserUseCase.execute({
      nickname: 'anonymous',
      password: 'Password!1',
    });

    messages.forEach(async (message) => {
      await createMessageUseCase.execute({
        from: (user.answer as CreateUserResponse).id,
        message,
        reply: null,
        where,
      });
    });
  });

  it('should be able to get messages', async () => {
    const messages = await getMessagesUseCase.execute({ where });

    expect((messages.answer as Message[]).length).toBe(15);
  });

  it('should return only 5 messages of 15', async () => {
    const messages = await getMessagesUseCase.execute({
      where,
      skip: 0,
      take: 5,
    });

    expect((messages.answer as Message[]).length).toBe(5);
  });
});
