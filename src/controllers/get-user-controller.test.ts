import { describe, expect, it } from 'vitest';
import request from 'supertest';
import { server } from 'config/server';
import { generateRandomID } from 'utils/generate-random-id';

describe('POST /auth/signin', () => {
  it('should be able to get a user', async () => {
    const nickname = generateRandomID(10);
    await request(server).post('/auth/signup').send({
      nickname,
      password: 'Password1!',
    });

    const response = await request(server).post('/auth/signin').send({
      nickname,
      password: 'Password1!',
    });

    expect(!!response.body?.token).toBeTruthy();
    expect(response.status).toBe(200);
  });
});
