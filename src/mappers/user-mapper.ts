import { Password } from 'domain/password';
import { User } from 'domain/user';

export interface PersistenceUser {
  id: string | null;
  nickname: string;
  password: string;
  createdAt: string;
  updatedAt: string;
}

export class UserMapper {
  static async toPersistence(user: User): Promise<PersistenceUser> {
    return {
      id: null,
      nickname: user.nickname,
      password: await user.password.value,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  static toDomain(user: PersistenceUser): User {
    const userPassword = Password.create({
      value: user.password,
      hashed: true,
    });
    const domainUser = new User({
      id: user.id,
      nickname: user.nickname,
      password: userPassword.answer as Password,
    });

    return domainUser;
  }
}
