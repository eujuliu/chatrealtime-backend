import { describe, expect, it } from 'vitest';
import { Message } from './message';
import { v4 as uuid } from 'uuid';
import { ValidationError } from 'core/errors';

describe('Create a message', () => {
  it('should be able to create a message', () => {
    const messageOrError = Message.create({
      message: 'Hello World',
      sender: uuid(),
      reply: null,
      where: uuid(),
    });

    expect(messageOrError.answer instanceof Message).toBeTruthy();
  });

  it('should be not able to create a message with length greater than 280', () => {
    const messageOrError = Message.create({
      message:
        'Embrace the unknown, for within its depths lie infinite possibilities. With curiosity as your guide and determination as your fuel, embark on a journey of self-discovery. Embrace challenges, learn from failures, and celebrate victories. Dare to dream, and let your passion ignite the path to greatness.',
      reply: null,
      sender: uuid(),
      where: uuid(),
    });

    expect(messageOrError.answer).toStrictEqual(
      new ValidationError({
        message: 'The length of the message exceeds the limit.',
        code: 400,
      }),
    );
  });
});
