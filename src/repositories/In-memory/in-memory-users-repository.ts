import { UsersRepository } from 'repositories/users-repository';
import { binaryToUuid } from 'utils/binary-to-uuid';
import { PersistenceUser } from 'mappers/user-mapper';

export class InMemoryUsersRepository implements UsersRepository {
  private readonly users: PersistenceUser[] = [];

  async exists(nickname: string): Promise<boolean> {
    const user = this.users.find((user) => user.nickname === nickname);

    return !!user;
  }

  async store(
    user: PersistenceUser,
  ): Promise<{ id: string; nickname: string }> {
    this.users.push(user);

    return {
      id: binaryToUuid(user.id),
      nickname: user.nickname,
    };
  }

  async show(
    by: 'id' | 'nickname',
    value: string,
  ): Promise<PersistenceUser | null> {
    const user = this.users.find((user) =>
      by === 'id' ? binaryToUuid(user[by]) === value : user[by] === value,
    );

    if (!user) {
      return null;
    }

    return user;
  }
}
