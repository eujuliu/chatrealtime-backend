import { uuidToBinary } from 'utils/uuid-to-binary';
import { Password } from 'core/domain/password';
import { User } from 'core/domain/user';

export interface PersistenceUser {
  id: Buffer;
  nickname: string;
  password: string;
  createdAt: string;
  updatedAt: string;
}

export interface DomainUser extends Omit<PersistenceUser, 'id'> {
  id: string;
}

export class UserMapper {
  static async toPersistence(user: User): Promise<DomainUser> {
    return {
      id: user.id,
      nickname: user.nickname,
      password: await user.password.value,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  static toDomain({
    id,
    nickname,
    password,
    createdAt,
    updatedAt,
  }: DomainUser): User {
    const userPassword = Password.create({
      value: password,
      hashed: true,
    });

    const domainUser = new User({
      id,
      nickname: nickname,
      password: userPassword.answer as Password,
      createdAt,
      updatedAt,
    });

    return domainUser;
  }
}
