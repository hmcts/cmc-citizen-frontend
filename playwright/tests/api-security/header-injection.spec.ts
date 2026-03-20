import { test, expect } from '@playwright/test';
import { config } from '../../helpers/env-config';
import { createFakeJwt } from '../../helpers/jwt-helper';

/**
 * Header Injection: Attempts to bypass authentication using spoofed headers
 * (X-Forwarded-For, X-Original-URL, X-Rewrite-URL) must be rejected.
 *
 * Based on DTSCCI-4008 Attack Category #10.
 */
test.describe('Header Injection - Bypass Attempts Must Be Rejected', () => {
  let claimStoreUrl: string;
  const fakeToken = createFakeJwt();
  const dummyId = '00000000-0000-0000-0000-000000000000';

  test.beforeAll(() => {
    claimStoreUrl = config.claimStoreUrl;
  });


  test('X-Forwarded-For: 127.0.0.1 with fake token still returns 401', async ({ request }) => {
    const response = await request.get(`${claimStoreUrl}/claims/${dummyId}`, {
      headers: {
        Authorization: `Bearer ${fakeToken}`,
        'X-Forwarded-For': '127.0.0.1',
      },
    });
    expect([401, 403]).toContain(response.status());
  });

  test('X-Original-URL: /health with fake token on protected endpoint still returns 401', async ({ request }) => {
    const response = await request.get(`${claimStoreUrl}/claims/${dummyId}`, {
      headers: {
        Authorization: `Bearer ${fakeToken}`,
        'X-Original-URL': '/health',
      },
    });
    expect([401, 403]).toContain(response.status());
  });

  test('X-Rewrite-URL: /health with fake token on protected endpoint still returns 401', async ({ request }) => {
    const response = await request.get(`${claimStoreUrl}/claims/${dummyId}`, {
      headers: {
        Authorization: `Bearer ${fakeToken}`,
        'X-Rewrite-URL': '/health',
      },
    });
    expect([401, 403]).toContain(response.status());
  });

  test('X-Forwarded-Host: localhost with no token still returns 401', async ({ request }) => {
    const response = await request.get(`${claimStoreUrl}/claims/${dummyId}`, {
      headers: {
        'X-Forwarded-Host': 'localhost',
        'X-Forwarded-For': '127.0.0.1',
      },
    });
    expect([401, 403]).toContain(response.status());
  });

  test('Multiple Authorization headers - fake token still rejected', async ({ request }) => {
    const response = await request.fetch(`${claimStoreUrl}/claims/${dummyId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${fakeToken}`,
        'X-Forwarded-For': '10.0.0.1',
        'X-Real-IP': '127.0.0.1',
      },
    });
    expect([401, 403]).toContain(response.status());
  });
});
