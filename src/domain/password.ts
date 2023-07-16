import bcrypt from 'bcryptjs';
import { ValidationError } from 'core/errors';
import { Result, exception, success } from 'core/logic/result';
import { validatePassword } from 'core/utils/validate-password';

interface PasswordProps {
  value: string;
  hashed?: boolean;
}

export class Password {
  constructor(private readonly props: PasswordProps) {
    this.props = props;
  }

  alreadyHashed(): boolean {
    return !!this.props.hashed;
  }

  get value(): Promise<string> {
    return new Promise((resolve) => {
      if (this.alreadyHashed()) {
        return resolve(this.props.value);
      }

      this.props.hashed = true;
      return resolve(this.hash(this.props.value));
    });
  }

  static create(props: PasswordProps): Result<ValidationError, Password> {
    if (props.hashed) {
      return success(
        new Password({ value: props.value, hashed: props.hashed }),
      );
    }

    if (!validatePassword(props.value)) {
      return exception(new ValidationError());
    }

    return success(new Password({ value: props.value, hashed: false }));
  }

  async compare(plainText: string): Promise<boolean> {
    let hashed: string;

    if (this.alreadyHashed()) {
      hashed = this.props.value;

      return this.bcryptCompare(plainText, hashed);
    }

    return this.props.value === plainText;
  }

  private bcryptCompare(plainText: string, hashed: string): Promise<boolean> {
    return new Promise((resolve) => {
      bcrypt.compare(plainText, hashed, (err, result) => {
        if (err) return resolve(false);

        return resolve(result);
      });
    });
  }

  private async hash(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();

    return new Promise((resolve, reject) => {
      bcrypt.hash(password, salt, (err, result) => {
        if (err) return reject(err);

        resolve(result);
      });
    });
  }
}
