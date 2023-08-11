import { binaryToUuid } from 'utils/binary-to-uuid';
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

export class UserMapper {
  static async toPersistence(user: User): Promise<PersistenceUser> {
    return {
      id: uuidToBinary(user.id),
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
      id: binaryToUuid(user.id),
      nickname: user.nickname,
      password: userPassword.answer as Password,
    });

    return domainUser;
  }
}
