import { CreateMessageController } from 'controllers/create-message-controller';
import { MongoDBMessagesRepository } from 'repositories/mongodb/mongodb-messages-repository';
import { PrismaUsersRepository } from 'repositories/prisma/prisma-users-repository';
import { CreateMessageUseCase } from 'use-cases/create-message-use-case';

export const createMessageFactory = () => {
  const messagesRepository = new MongoDBMessagesRepository();
  const usersRepository = new PrismaUsersRepository();
  const createMessageUseCase = new CreateMessageUseCase(
    messagesRepository,
    usersRepository,
  );
  const createMessageController = new CreateMessageController(
    createMessageUseCase,
  );

  return createMessageController;
};
