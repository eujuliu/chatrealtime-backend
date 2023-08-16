import { ValidationError } from 'core/errors';
import { Password } from './password';
import { validateNickname } from 'utils/validate-nickname';
import { Result, exception, success } from 'utils/result';
import { v4 as uuid } from 'uuid';

interface UserProps {
  id?: string;
  nickname: string;
  password: Password;
  createdAt?: string;
  updatedAt?: string;
}

export class User {
  readonly id: string;
  readonly nickname: string;
  readonly password: Password;
  readonly createdAt: string;
  readonly updatedAt: string;

  constructor({ id, nickname, password, createdAt, updatedAt }: UserProps) {
    this.id = id || uuid();
    this.nickname = nickname;
    this.password = password;
    this.createdAt = createdAt || new Date().toISOString();
    this.updatedAt = updatedAt || new Date().toISOString();
  }

  static create(
    nickname: string,
    password: string,
  ): Result<ValidationError, User> {
    if (!validateNickname(nickname)) {
      return exception(new ValidationError());
    }

    const passwordOrError = Password.create({ value: password });

    if (passwordOrError.exception()) {
      return exception(passwordOrError.answer);
    }

    return success(
      new User({
        nickname,
        password: passwordOrError.answer as Password,
      }),
    );
  }
}
