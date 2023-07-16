import { InMemoryUsersRepository } from 'repositories/In-memory/in-memory-users-repository';
import { describe, expect, it } from 'vitest';
import { GetUserUseCase } from './get-user-use-case';
import { CreateUserUseCase } from './create-user-use-case';

describe('Get user (use-case)', () => {
  it('should be able to get the user', async () => {
    const usersRepository = new InMemoryUsersRepository();
    const createUserUseCase = new CreateUserUseCase(usersRepository);
    const getUserUseCase = new GetUserUseCase(usersRepository);

    await createUserUseCase.execute({
      nickname: 'user1',
      password: 'Password!1',
    });

    const userOrError = await getUserUseCase.execute({
      nickname: 'user1',
      password: 'Password!1',
    });

    expect(userOrError.answer).toHaveProperty('id');
    expect(userOrError.answer).toHaveProperty('nickname');
  });
});
