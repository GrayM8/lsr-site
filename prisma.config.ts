import { defineConfig } from '@prisma/internals';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  seed: 'node prisma/seed.cjs',
});
