import { describe, expect, it, vi } from 'vitest';
import prisma from 'config/tests/__mocks__/prisma';
import { uuidToBinary } from 'utils/uuid-to-binary';
import { v4 as uuid } from 'uuid';
import { PrismaUsersRepository } from './prisma-users-repository';
import { binaryToUuid } from 'utils/binary-to-uuid';

vi.mock('infra/prisma/client.ts');

describe('Prisma Users repository', () => {
  const prismaUsersRepository = new PrismaUsersRepository();
  const id = uuid();
  const exampleUser = {
    id: uuidToBinary(id),
    nickname: 'anonymous',
    password: 'Password!1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  it('should be able to create a user', async () => {
    prisma.user.create.mockResolvedValue(exampleUser);

    const user = await prismaUsersRepository.store({ ...exampleUser, id });

    expect(user).toHaveProperty('id', id);
  });

  it('should be able to verify if a user exists', async () => {
    prisma.user.create.mockResolvedValue(exampleUser);

    await prismaUsersRepository.store({ ...exampleUser, id });

    const exists = await prismaUsersRepository.exists(exampleUser.nickname);

    expect(exists).toBeTruthy();
  });

  it('should be able to get user by id', async () => {
    prisma.user.create.mockResolvedValue(exampleUser);

    await prismaUsersRepository.store({ ...exampleUser, id });

    const user = await prismaUsersRepository.show(
      'id',
      binaryToUuid(exampleUser.id),
    );

    expect(user).toHaveProperty('id', id);
  });

  it('should be able to get user by nickname', async () => {
    prisma.user.create.mockResolvedValue(exampleUser);

    await prismaUsersRepository.store({ ...exampleUser, id });

    const user = await prismaUsersRepository.show(
      'nickname',
      exampleUser.nickname,
    );

    expect(user).toHaveProperty('nickname');
  });
});
