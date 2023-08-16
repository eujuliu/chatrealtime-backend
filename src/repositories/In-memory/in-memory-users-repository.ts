import { UsersRepository } from 'repositories/users-repository';
import { binaryToUuid } from 'utils/binary-to-uuid';
import { DomainUser, PersistenceUser } from 'mappers/user-mapper';
import { uuidToBinary } from 'utils/uuid-to-binary';

export class InMemoryUsersRepository implements UsersRepository {
  private readonly users: PersistenceUser[] = [];

  async exists(nickname: string): Promise<boolean> {
    const user = this.users.find((user) => user.nickname === nickname);

    return !!user;
  }

  async store(user: DomainUser): Promise<{ id: string; nickname: string }> {
    this.users.push({ ...user, id: uuidToBinary(user.id) });

    return {
      id: user.id,
      nickname: user.nickname,
    };
  }

  async show(by: 'id' | 'nickname', value: string): Promise<DomainUser | null> {
    const user = this.users.find((user) =>
      by === 'id' ? binaryToUuid(user[by]) === value : user[by] === value,
    );

    if (!user) {
      return null;
    }

    return {
      ...user,
      id: binaryToUuid(user.id),
    };
  }
}
