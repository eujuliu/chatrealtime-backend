import { expect, test } from 'vitest';
import { uuidToBinary } from './uuid-to-binary';
import { v4 as uuid } from 'uuid';
import { binaryToUuid } from './binary-to-uuid';

test('Should be able to convert a binary to uuid', () => {
  const myUuid = uuid();
  const buffer = uuidToBinary(myUuid);

  expect(binaryToUuid(buffer)).toBe(myUuid);
});
