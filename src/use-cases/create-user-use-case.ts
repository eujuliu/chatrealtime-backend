import { Result } from 'core/domain/result';
import { ValidationError } from 'core/errors';
import { User } from 'domain/user';
import { UserMapper } from 'mappers/user-mapper';
import { UsersRepository } from 'repositories/users-repository';

interface Request {
  nickname: string;
  password: string;
}

export class CreateUserUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    nickname,
    password,
  }: Request): Promise<
    Result<ValidationError | { id: string; nickname: string }>
  > {
    const exists = await this.usersRepository.exists(nickname);

    if (exists) {
      return {
        ok: false,
        answer: new ValidationError({
          code: 409,
          message: 'The nickname you provided is already in use.',
        }),
      };
    }

    const userOrError = User.create(nickname, password);

    if (!userOrError.ok) return userOrError as Result<ValidationError>;

    const toPersistence = await UserMapper.toPersistence(
      userOrError.answer as User,
    );

    const response = await this.usersRepository.store(toPersistence);

    return {
      ok: true,
      answer: response,
    };
  }
}
