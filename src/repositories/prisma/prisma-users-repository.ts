import { binaryToUuid } from 'utils/binary-to-uuid';
import { prisma } from 'infra/prisma/client';
import { DomainUser } from 'mappers/user-mapper';
import { UsersRepository } from 'repositories/users-repository';
import { uuidToBinary } from 'utils/uuid-to-binary';

export class PrismaUsersRepository implements UsersRepository {
  async exists(nickname: string): Promise<boolean> {
    const exists = await prisma.user.findUnique({
      where: {
        nickname,
      },
    });

    return !!exists;
  }

  async store(user: DomainUser): Promise<{ id: string; nickname: string }> {
    const persistenceUser = await prisma.user.create({
      data: {
        id: uuidToBinary(user.id),
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

  async show(by: 'id' | 'nickname', value: string): Promise<DomainUser | null> {
    const user = await prisma.user.findUnique({
      where: {
        [by]: by === 'id' ? uuidToBinary(value) : value,
      },
    });

    if (!user) {
      return null;
    }

    return {
      ...user,
      id: binaryToUuid(user.id),
    };
  }
}
