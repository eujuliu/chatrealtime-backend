import { v4 as uuid } from 'uuid';

interface ErrorProps {
  message?: string;
  identifier?: string;
  statusCode?: number;
}

export class BaseError extends Error {
  readonly name: string;
  readonly message: string;
  readonly identifier: string;
  readonly statusCode: number;

  constructor({
    message,
    identifier,
    statusCode,
  }: {
    message: string;
    identifier?: string;
    statusCode: number;
  }) {
    super();
    this.name = this.constructor.name;
    this.message = message;
    this.identifier = identifier || uuid();
    this.statusCode = statusCode;
  }
}

export class InternalServerError extends BaseError {
  constructor(props?: ErrorProps) {
    super({
      message:
        props?.message ||
        'An internal server error occurred, please contact the system administrator',
      identifier: props?.identifier,
      statusCode: props?.statusCode || 500,
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
      statusCode: props?.statusCode || 422,
    });
  }
}
