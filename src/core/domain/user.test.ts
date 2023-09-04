import { describe, expect, it } from 'vitest';
import { User } from './user';
import { ValidationError } from 'core/errors';

describe('Create user (domain)', () => {
  it('should be able to create a new user', () => {
    const userOrError = User.create('anonymous', 'Password1!');

    expect(userOrError.answer).toBeInstanceOf(User);
  });

  it('should be not able to create a user', () => {
    const userOrError = User.create('anon', 'Password1!');

    expect(userOrError.answer).toStrictEqual(
      new ValidationError({
        message: 'This nickname is not valid',
      }),
    );
  });
});
