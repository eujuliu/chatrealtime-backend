export type Result<E, S> = Exception<E, S> | Success<E, S>;

export class Exception<E, S> {
  ok = false;
  answer: E;

  constructor(value: E) {
    this.answer = value;
  }

  exception(): this is Exception<E, S> {
    return true;
  }

  success(): this is Success<E, S> {
    return false;
  }
}

export class Success<E, S> {
  ok = true;
  answer: S;

  constructor(value: S) {
    this.answer = value;
  }

  exception(): this is Exception<E, S> {
    return false;
  }

  success(): this is Success<E, S> {
    return true;
  }
}

export const exception = <E, S>(e: E): Result<E, S> => {
  return new Exception(e);
};

export const success = <E, S>(s: S): Result<E, S> => {
  return new Success(s);
};
