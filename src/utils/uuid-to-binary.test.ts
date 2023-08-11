import { expect, test } from 'vitest';
import { uuidToBinary } from './uuid-to-binary';
import { v4 as uuid } from 'uuid';
import { binaryToUuid } from './binary-to-uuid';

test('Should be able to convert a uuid to binary', () => {
  const myUuid = uuid();
  const result = uuidToBinary(myUuid);

  expect(result).toBeInstanceOf(Buffer);
  expect(binaryToUuid(result)).toBe(myUuid);
});
