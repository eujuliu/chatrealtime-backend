import { v4 as uuid } from 'uuid';
import { expect, test } from 'vitest';
import { generateJsonWebToken } from './generate-json-web-token';
import jwt from 'jsonwebtoken';
import { SECRET } from 'config';

test('Should be able to return a JWT', () => {
  const user = {
    id: uuid(),
    nickname: 'anonymous',
  };

  const token = generateJsonWebToken(user);
  const verify = jwt.verify(token, SECRET);

  expect(verify).toHaveProperty('id');
  expect(verify).toHaveProperty('nickname');
  expect(verify).toHaveProperty('iat');
  expect(verify).toHaveProperty('exp');
});
