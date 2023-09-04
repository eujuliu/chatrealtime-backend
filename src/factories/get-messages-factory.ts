import { GetMessagesController } from 'controllers/get-messages-controller';
import { MongoDBMessagesRepository } from 'repositories/mongodb/mongodb-messages-repository';
import { GetMessagesUseCase } from 'use-cases/get-messages-use-case';

export const getMessagesFactory = () => {
  const messagesRepository = new MongoDBMessagesRepository();
  const getMessagesUseCase = new GetMessagesUseCase(messagesRepository);
  const getMessagesController = new GetMessagesController(getMessagesUseCase);

  return getMessagesController;
};
