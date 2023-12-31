import { ValidationError } from 'core/errors';
import { User } from 'core/domain/user';
import { UsersRepository } from 'repositories/users-repository';
import { Result, exception, success } from 'utils/result';
import { UserMapper } from 'mappers/user-mapper';

interface Request {
  nickname: string;
  password: string;
}

export interface CreateUserResponse {
  id: string;
  nickname: string;
}

export class CreateUserUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    nickname,
    password,
  }: Request): Promise<Result<ValidationError, CreateUserResponse>> {
    const exists = await this.usersRepository.exists(nickname);

    if (exists) {
      return exception(
        new ValidationError({
          statusCode: 409,
          message: 'The nickname you provided is already in use.',
        }),
      );
    }

    const userOrError = User.create(nickname, password);

    if (userOrError.exception()) return exception(userOrError.answer);

    const toPersistence = await UserMapper.toPersistence(userOrError.answer);

    const response = await this.usersRepository.store(toPersistence);

    return success(response);
  }
}
