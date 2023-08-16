import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src', '!**/*.{sql,prisma,toml}'],
});
