import { binaryToUuid } from 'utils/binary-to-uuid';
import { prisma } from 'core/infra/prisma/client';
import { PersistenceUser } from 'mappers/user-mapper';
import { UsersRepository } from 'repositories/users-repository';

export class PrismaUsersRepository implements UsersRepository {
  async exists(nickname: string): Promise<boolean> {
    const exists = await prisma.user.findUnique({
      where: {
        nickname,
      },
    });

    return !!exists;
  }

  async store(
    user: PersistenceUser,
  ): Promise<{ id: string; nickname: string }> {
    const persistenceUser = await prisma.user.create({
      data: {
        id: user.id,
        nickname: user.nickname,
        password: user.password,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });

    return {
      id: binaryToUuid(persistenceUser.id),
      nickname: persistenceUser.nickname,
    };
  }

  async show(
    by: 'id' | 'nickname',
    value: string,
  ): Promise<PersistenceUser | null> {
    const user = await prisma.user.findUnique({
      where: {
        [by]: value,
      },
    });

    if (!user) {
      return null;
    }

    return user;
  }
}
