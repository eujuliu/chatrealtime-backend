import resetDb from './helpers/reset-db';
import { afterEach } from 'vitest';

afterEach(async () => {
  await resetDb();
});
