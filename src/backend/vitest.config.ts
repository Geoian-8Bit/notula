import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    include: ['src/**/*.test.ts'],
    globalSetup: ['src/test/setup.ts'],
    testTimeout: 20_000,
    coverage: { provider: 'v8', reporter: ['text', 'lcov'] },
  },
});
