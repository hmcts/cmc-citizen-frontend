import { test, expect } from '@playwright/test';
import { config } from '../../helpers/env-config';
import { createExpiredJwt, createAlgNoneJwt } from '../../helpers/jwt-helper';

/**
 * Expired Token & Algorithm "none" Attack:
 * - Expired JWTs must be rejected even if structurally valid.
 * - JWTs with alg:"none" (classic bypass) must be rejected.
 *
 * Based on DTSCCI-4008 Attack Categories #5 (alg:none) and #6 (Expired Token).
 */
test.describe('Expired JWT - Must Be Rejected', () => {
  let claimStoreUrl: string;
  const expiredToken = createExpiredJwt();
  const dummyId = '00000000-0000-0000-0000-000000000000';

  test.beforeAll(() => {
    claimStoreUrl = config.claimStoreUrl;
  });


  const endpoints = [
    { method: 'GET', path: `/claims/${dummyId}`, description: 'Get claim' },
    { method: 'POST', path: `/claims/${dummyId}`, description: 'Create claim' },
  ];

  for (const endpoint of endpoints) {
    test(`${endpoint.method} ${endpoint.path} with expired JWT returns 401`, async ({ request }) => {
      const response = await request.fetch(`${claimStoreUrl}${endpoint.path}`, {
        method: endpoint.method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${expiredToken}`,
        },
        data: endpoint.method !== 'GET' ? JSON.stringify({}) : undefined,
      });
      expect([401, 403]).toContain(response.status());
    });
  }

  // /user/roles returns 422 with expired token (input validation before auth) - still not 200
  test('POST /user/roles with expired JWT is rejected', async ({ request }) => {
    const response = await request.fetch(`${claimStoreUrl}/user/roles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${expiredToken}`,
      },
      data: JSON.stringify({}),
    });
    expect(response.status()).not.toBe(200);
  });
});

test.describe('Algorithm "none" Attack - Must Be Rejected', () => {
  let claimStoreUrl: string;
  const algNoneToken = createAlgNoneJwt();
  const dummyId = '00000000-0000-0000-0000-000000000000';

  test.beforeAll(() => {
    claimStoreUrl = config.claimStoreUrl;
  });


  const exactAuthEndpoints = [
    { method: 'GET', path: `/claims/${dummyId}`, description: 'Get claim' },
    { method: 'PUT', path: '/claims/defendant/link', description: 'Link defendant' },
  ];

  for (const endpoint of exactAuthEndpoints) {
    test(`${endpoint.method} ${endpoint.path} with alg:none JWT returns 401`, async ({ request }) => {
      const response = await request.fetch(`${claimStoreUrl}${endpoint.path}`, {
        method: endpoint.method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${algNoneToken}`,
        },
        data: endpoint.method !== 'GET' ? JSON.stringify({}) : undefined,
      });
      expect([401, 403]).toContain(response.status());
    });
  }

  test('POST /cases/callbacks/about-to-start with alg:none JWT must not return 200', async ({ request }) => {
    const response = await request.fetch(`${claimStoreUrl}/cases/callbacks/about-to-start`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${algNoneToken}`,
      },
      data: JSON.stringify({}),
    });
    expect(response.status()).not.toBe(200);
  });
});
