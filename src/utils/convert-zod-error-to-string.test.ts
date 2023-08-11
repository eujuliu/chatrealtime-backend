import { expect, test } from 'vitest';
import { convertZodErrorToString } from './convert-zod-error-to-string';
import { z } from 'zod';

test('Should convert Zod array error to string', () => {
  const arr: z.ZodIssue[] = [
    {
      code: 'too_small',
      minimum: 5,
      type: 'string',
      inclusive: true,
      exact: false,
      message: 'String must contain at least 5 character(s)',
      path: ['nickname'],
    },
    {
      code: 'too_small',
      minimum: 8,
      type: 'string',
      inclusive: true,
      exact: false,
      message: 'String must contain at least 8 character(s)',
      path: ['password'],
    },
    {
      code: 'unrecognized_keys',
      keys: ['hello', 'test'],
      path: [],
      message: "Unrecognized key(s) in object: 'hello', 'test'",
    },
  ];
  const str = convertZodErrorToString(arr);

  expect(str).toBe(
    "(Path: nickname): String must contain at least 5 character(s), (Path: password): String must contain at least 8 character(s), Unrecognized key(s) in object: 'hello', 'test'",
  );
});
