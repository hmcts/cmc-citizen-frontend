import { defineConfig } from '@playwright/test';
import os from 'node:os';

export default defineConfig({
  testDir: './tests',
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: false,
  retries: 1,
  workers: 1,
  reporter: [
    [
      'allure-playwright',
      {
        outputFolder: '../allure-results',
        environmentInfo: {
          Environment: process.env.ENVIRONMENT || 'preview',
          ClaimStoreUrl: process.env.CLAIM_STORE_URL || '',
          OS: os.platform(),
          Architecture: os.arch(),
          NodeVersion: process.version,
        },
      },
    ],
    ['junit', { outputFile: '../playwright-report/results.xml' }],
    ['list'],
  ],
  use: {
    extraHTTPHeaders: {
      'Content-Type': 'application/json',
    },
  },
  projects: [
    {
      name: 'api-security',
      testDir: './tests/api-security',
      fullyParallel: true,
      workers: 4,
    },
    {
      name: 'api-functional',
      testDir: './tests/api-functional',
      fullyParallel: false,
      workers: 1,
    },
  ],
});
