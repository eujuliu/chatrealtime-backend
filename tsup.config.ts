import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src', '!**/*.{sql,toml,tf}'],
  loader: {
    '.prisma': 'copy',
  },
  outDir: 'dist/src',
});
