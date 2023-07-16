import { ValidationError } from 'core/errors';
import { Password } from './password';
import { validateNickname } from 'core/utils/validate-nickname';
import { Result } from 'core/domain/result';

interface UserProps {
  id: string | null;
  nickname: string;
  password: Password;
}

export class User {
  readonly id: string | null;
  readonly nickname: string;
  readonly password: Password;
  readonly createdAt: string;
  readonly updatedAt: string;

  constructor({ id, nickname, password }: UserProps) {
    this.id = id;
    this.nickname = nickname;
    this.password = password;
    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  static create(
    nickname: string,
    password: string,
  ): Result<ValidationError | User> {
    if (!validateNickname(nickname)) {
      return {
        ok: false,
        answer: new ValidationError(),
      };
    }

    const passwordOrError = Password.create({ value: password });

    if (!passwordOrError.ok) {
      return passwordOrError as Result<ValidationError>;
    }

    return {
      ok: true,
      answer: new User({
        id: null,
        nickname,
        password: passwordOrError.answer as Password,
      }),
    };
  }
}
