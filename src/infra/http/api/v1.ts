import { Router } from 'express';
import { createUserFactory } from 'factories/create-user-factory';

const routes = Router();

routes.post('/auth/signup', (request, response) => {
  return createUserFactory().handle(request, response);
});

export { routes };
