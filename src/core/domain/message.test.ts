import { describe, expect, it } from 'vitest';
import { Message } from './message';
import { v4 as uuid } from 'uuid';
import { ValidationError } from 'core/errors';

describe('Create message (entity)', () => {
  it('should be able to create a message', () => {
    const messageOrError = Message.create({
      message:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce in nunc neque."',
      from: {
        id: uuid(),
        nickname: 'anonymous',
      },
      where: uuid(),
      reply: null,
    });

    expect(messageOrError.answer).toBeInstanceOf(Message);
  });

  it('should be not able to create a message with length more than 280', () => {
    const messageOrError = Message.create({
      message:
        "In the depths of the cosmos, a celestial dance unfolds. Stars shimmer like cosmic fireflies, painting the ebony canvas. Planets, like jewels, adorn the night sky. Each speckle of light tells a story—of birth, of wonder, of time's eternal passage. Amidst this cosmic symphony, Earth spins, a blue-green oasis teeming with life.",
      from: {
        id: uuid(),
        nickname: 'anonymous',
      },
      where: uuid(),
      reply: null,
    });

    expect(messageOrError.answer).toStrictEqual(
      new ValidationError({
        message:
          'The length of the message exceeds the limit of 280 characters.',
        statusCode: 400,
      }),
    );
  });
});
