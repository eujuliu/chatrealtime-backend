import { expect, test } from 'vitest';
import { generateRandomID } from './generate-random-id';

test('should be able to return a random id with length equal to 10', () => {
  const randomId = generateRandomID(10);

  expect(randomId.length).toEqual(10);
});
