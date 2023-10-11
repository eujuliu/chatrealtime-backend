import { Request, Router } from 'express';
import { createUserFactory } from 'factories/create-user-factory';
import { getMessagesFactory } from 'factories/get-messages-factory';
import { getUserFactory } from 'factories/get-user-factory';
import { authenticateToken } from '../middlewares/auth';

const routes = Router();

routes.post('/auth/signup', (request, response) =>
  createUserFactory().handle(request, response),
);

routes.post('/auth/signin', (request, response) =>
  getUserFactory().handle(request, response),
);

routes.get('/messages', authenticateToken, (request: Request, response) =>
  getMessagesFactory().handle(request, response),
);

export { routes };
