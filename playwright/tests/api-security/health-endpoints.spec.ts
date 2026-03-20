import { test, expect } from '@playwright/test';
import { config } from '../../helpers/env-config';

/**
 * Sanity: Health endpoints must remain publicly accessible without authentication.
 * These are whitelisted in Spring Security and should return 200 with no token.
 */
test.describe('Health Endpoints - Whitelisted (No Auth Required)', () => {
  let claimStoreUrl: string;

  test.beforeAll(() => {
    claimStoreUrl = config.claimStoreUrl;
  });

  test('GET /health returns 200', async ({ request }) => {
    const response = await request.get(`${claimStoreUrl}/health`);
    expect(response.status()).toBe(200);
  });

  test('GET /health/liveness returns 200', async ({ request }) => {
    const response = await request.get(`${claimStoreUrl}/health/liveness`);
    expect(response.status()).toBe(200);
  });

  test('GET /health/readiness returns 200', async ({ request }) => {
    const response = await request.get(`${claimStoreUrl}/health/readiness`);
    expect(response.status()).toBe(200);
  });
});
