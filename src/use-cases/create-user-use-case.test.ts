import { InMemoryUsersRepository } from 'repositories/In-memory/in-memory-users-repository';
import { beforeAll, describe, expect, it } from 'vitest';
import { CreateUserUseCase } from './create-user-use-case';
import { UsersRepository } from 'repositories/users-repository';
import { ValidationError } from 'core/errors';
import jwt from 'jsonwebtoken';
import { SECRET } from 'config';

describe('Create a user', () => {
  let userRepository: UsersRepository;
  let createUserUseCase: CreateUserUseCase;

  beforeAll(() => {
    userRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(userRepository);
  });

  it('should be able to create a user', async () => {
    const userOrError = await createUserUseCase.execute({
      nickname: 'anonymous',
      password: 'anonym0uS!',
    });

    expect(userOrError.answer).toHaveProperty('id');
    expect(userOrError.answer).toHaveProperty('nickname');
  });

  it('should be not able to create a existing user', async () => {
    const user = {
      nickname: 'anonym0us',
      password: 'anonym0uS!',
    };
    await createUserUseCase.execute(user);

    const responseOrError = await createUserUseCase.execute(user);

    expect(responseOrError.answer).toStrictEqual(
      new ValidationError({
        code: 409,
        message: 'The nickname you provided is already in use.',
      }),
    );
  });
});
