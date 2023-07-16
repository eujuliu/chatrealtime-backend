import { v4 as uuid } from 'uuid';

interface ErrorProps {
  message?: string;
  identifier?: string;
  code?: number;
}

export class BaseError extends Error {
  readonly name: string;
  readonly message: string;
  readonly identifier: string;
  readonly code: number;

  constructor({
    message,
    identifier,
    code,
  }: {
    message: string;
    identifier?: string;
    code: number;
  }) {
    super();
    this.name = this.constructor.name;
    this.message = message;
    this.identifier = identifier || uuid();
    this.code = code;
  }
}

export class InternalServerError extends BaseError {
  constructor(props?: ErrorProps) {
    super({
      message:
        props?.message ||
        'An internal server error occurred, please contact the system administrator',
      identifier: props?.identifier,
      code: props?.code || 500,
    });
  }
}

export class ValidationError extends BaseError {
  constructor(props?: ErrorProps) {
    super({
      message:
        props?.message ||
        'Validation failed for the request, correct the input fields and try again',
      identifier: props?.identifier,
      code: props?.code || 422,
    });
  }
}
