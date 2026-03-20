import { test, expect } from '@playwright/test';
import { config } from '../../helpers/env-config';

/**
 * HTTP Method Tampering: Protected endpoints must not accept unexpected HTTP methods.
 * For example, a DELETE on /claims should not return 200.
 *
 * Based on DTSCCI-4008 Attack Category #9.
 */
test.describe('HTTP Method Tampering - Must Not Return 200', () => {
  let claimStoreUrl: string;
  const dummyId = '00000000-0000-0000-0000-000000000000';
  const dummyRef = '000MC001';

  test.beforeAll(() => {
    claimStoreUrl = config.claimStoreUrl;
  });


  const tamperAttempts = [
    { method: 'DELETE', path: `/claims/${dummyId}`, description: 'DELETE on claims endpoint' },
    { method: 'PATCH', path: `/claims/${dummyId}`, description: 'PATCH on claims endpoint' },
    { method: 'DELETE', path: `/support/claim/${dummyRef}/reset-operation`, description: 'DELETE on support endpoint' },
    { method: 'GET', path: `/responses/claim/${dummyId}/defendant/${dummyId}`, description: 'GET on POST-only response endpoint' },
    { method: 'DELETE', path: '/user/roles', description: 'DELETE on user roles' },
  ];

  for (const attempt of tamperAttempts) {
    test(`${attempt.method} ${attempt.path} must not return 200 - ${attempt.description}`, async ({ request }) => {
      const response = await request.fetch(`${claimStoreUrl}${attempt.path}`, {
        method: attempt.method,
        headers: { 'Content-Type': 'application/json' },
      });
      expect(response.status()).not.toBe(200);
    });
  }
});
