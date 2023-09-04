import { describe, expect, it } from 'vitest';
import { Password } from './password';
import { ValidationError } from 'core/errors';

describe('Password entity', () => {
  it('should be able to create a new password', () => {
    const passwordOrError = Password.create({ value: 'Password1!' });

    expect(passwordOrError.answer).toBeInstanceOf(Password);
  });

  it('should be not able to create a weak password', () => {
    const passwordOrError = Password.create({ value: 'Password1' });

    expect(passwordOrError.answer).toStrictEqual(
      new ValidationError({
        message: 'This password is not valid',
      }),
    );
  });

  it('should be able to hash the password', async () => {
    const password = Password.create({ value: 'Password1!' })
      .answer as Password;
    const hashedPassword = await password.value;

    expect(hashedPassword).toContain('$2a$');
  });

  it('should be able to compare the passwords', async () => {
    const password = Password.create({ value: 'Password1!' })
      .answer as Password;

    expect(password.compare('Password1')).toBeTruthy();
  });
});
