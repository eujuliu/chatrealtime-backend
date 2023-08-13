import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src', '!src/core/infra/prisma'],
});
