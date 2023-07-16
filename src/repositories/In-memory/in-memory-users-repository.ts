import { UsersRepository } from 'repositories/users-repository';
import { PersistenceUser } from 'core/utils/mappers/user-mapper';
import { v4 as uuid } from 'uuid';

export class InMemoryUsersRepository implements UsersRepository {
  private readonly users: PersistenceUser[] = [];

  async exists(nickname: string): Promise<boolean> {
    const user = this.users.find((user) => user.nickname === nickname);

    return !!user;
  }

  async store(
    user: PersistenceUser,
  ): Promise<{ id: string; nickname: string }> {
    const userWithId = {
      ...user,
      id: uuid(),
    };

    this.users.push(userWithId);

    return {
      id: userWithId.id,
      nickname: userWithId.nickname,
    };
  }

  async show(nickname: string): Promise<PersistenceUser | null> {
    const user = this.users.find((user) => user.nickname === nickname);

    return user as PersistenceUser | null;
  }
}
