import { describe, expect, it } from 'vitest';
import request from 'supertest';
import { server } from 'config/server';

describe('POST /auth/signin', () => {
  it('should be able to get a user', async () => {
    await request(server).post('/auth/signup').send({
      nickname: 'anonymous7',
      password: 'Password1!',
    });

    const response = await request(server).post('/auth/signin').send({
      nickname: 'anonymous7',
      password: 'Password1!',
    });

    expect(response.get('Set-Cookie').length).toBe(1);
    expect(response.status).toBe(200);
  });
});
