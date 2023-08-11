import { ValidationError } from 'core/errors';
import { Result, exception, success } from 'utils/result';
import { UserMapper } from 'mappers/user-mapper';
import { UsersRepository } from 'repositories/users-repository';

interface Request {
  nickname: string;
  password: string;
}

export class GetUserUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    nickname,
    password,
  }: Request): Promise<
    Result<ValidationError, { id: string; nickname: string }>
  > {
    const user = await this.usersRepository.show('nickname', nickname);

    if (!user) {
      return exception(new ValidationError());
    }

    const domainUser = UserMapper.toDomain(user);
    const passwordIsEqual = await domainUser.password.compare(password);

    if (!passwordIsEqual) {
      return exception(new ValidationError());
    }

    return success({
      id: domainUser.id,
      nickname: domainUser.nickname,
    });
  }
}
