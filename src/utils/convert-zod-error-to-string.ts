import { z } from 'zod';

export function convertZodErrorToString(errors: z.ZodIssue[]): string {
  return errors
    .reduce((acc, error) => {
      let str = '';

      if (error.code === 'too_small' || error.code === 'too_big') {
        str = `(Path: ${error.path.join('.')}): ${error.message}, `;
      } else if (error.code === 'unrecognized_keys') {
        str = `${error.message}, `;
      }

      return acc + str;
    }, '')
    .trim()
    .slice(0, -1);
}
