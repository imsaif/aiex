import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: '.',
  testMatch: 'audit-viewport-test.ts',
  timeout: 30000,
  use: {
    browserName: 'chromium',
    baseURL: 'http://localhost:3000',
  },
  reporter: 'list',
});
