import { server } from 'config/server';
import request from 'supertest';
import { generateRandomID } from 'utils/generate-random-id';
import { describe, expect, it } from 'vitest';

describe('POST /auth/signup', () => {
  it('should be able to return a JSONWEBTOKEN', async () => {
    const nickname = generateRandomID(10);
    const response = await request(server).post('/auth/signup').send({
      nickname,
      password: 'Password1!',
    });

    expect(!!response.body?.token).toBeTruthy();
    expect(response.statusCode).toBe(201);
  });

  it('should be not able to create a user if the nickname has 4 letters', async () => {
    const nickname = generateRandomID(4);
    const response = await request(server).post('/auth/signup').send({
      nickname,
      password: 'Password1!',
    });

    expect(response.statusCode).toBe(422);
    expect(response.body.message).toBe(
      '(Path: nickname): String must contain at least 5 character(s)',
    );
  });
});
