import { QueryParams } from 'controllers/get-messages-controller';
import { Request, Router } from 'express';
import { createUserFactory } from 'factories/create-user-factory';
import { getMessagesFactory } from 'factories/get-messages-factory';
import { getUserFactory } from 'factories/get-user-factory';

const routes = Router();

routes.post('/auth/signup', (request, response) => {
  return createUserFactory().handle(request, response);
});

routes.post('/auth/signin', (request, response) => {
  return getUserFactory().handle(request, response);
});

routes.get(
  '/messages',
  (request: Request<unknown, unknown, unknown, QueryParams>, response) => {
    return getMessagesFactory().handle(request, response);
  },
);

export { routes };
