import { Result } from 'core/domain/result';
import { ValidationError } from 'core/errors';
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
    Result<ValidationError | { id: string; nickname: string }>
  > {
    const user = await this.usersRepository.show(nickname);

    if (!user) {
      return {
        ok: false,
        answer: new ValidationError(),
      };
    }

    const domainUser = UserMapper.toDomain(user);
    const passwordIsEqual = await domainUser.password.compare(password);

    if (!passwordIsEqual) {
      return {
        ok: false,
        answer: new ValidationError(),
      };
    }

    return {
      ok: true,
      answer: {
        id: user.id as string,
        nickname: user.nickname,
      },
    };
  }
}
