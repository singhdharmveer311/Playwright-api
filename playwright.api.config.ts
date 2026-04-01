import { defineConfig } from '@playwright/test';

const API_PORT = 4300;

export default defineConfig({
  testDir: './api/tests',
  fullyParallel: false,
  workers: 1,
  timeout: 30_000,
  reporter: [['list'],['html']],
  use: {
    baseURL: `http://127.0.0.1:${API_PORT}`,
    extraHTTPHeaders: {
      Accept: 'application/json',
    },
    trace: 'off',
    screenshot: 'off',
    video: 'off',
  },
  webServer: {
    command: 'node api-mock/server.mjs',
    port: API_PORT,
    reuseExistingServer: true,
    timeout: 10_000,
  },
});
