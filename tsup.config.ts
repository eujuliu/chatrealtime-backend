import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src', '!**/*.{sql,toml}'],
  loader: {
    '.prisma': 'copy',
  },
  outDir: 'dist/src',
});
