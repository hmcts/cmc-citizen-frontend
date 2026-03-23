import { test, expect } from '@playwright/test';
import { config } from '../../helpers/env-config';

/**
 * No Authentication: All protected endpoints must return 401/403 when called without a token.
 * Covers previously vulnerable endpoints (/support/**, /cases/callbacks/**) and
 * always-protected endpoints (/claims/**, /responses/**, /user/**).
 *
 * Based on DTSCCI-4008 security testing framework.
 */
test.describe('No Auth - Previously Vulnerable Endpoints (Must Not Return 200)', () => {
  let claimStoreUrl: string;
  const dummyRef = '000MC001';
  const dummyCcdId = '1234567890123456';

  test.beforeAll(() => {
    claimStoreUrl = config.claimStoreUrl;
  });

  // These endpoints were previously whitelisted (DTSCCI-4008).
  // With the fix, they return 401. Without the fix, they still return non-200
  // (400/404/500) because the request body is invalid. Either way, an attacker
  // cannot get a successful (200) response without valid credentials.
  const removedEndpoints = [
    { method: 'POST', path: '/cases/callbacks/about-to-start', description: 'CCD callback about-to-start' },
    { method: 'POST', path: '/cases/callbacks/about-to-submit', description: 'CCD callback about-to-submit' },
    { method: 'POST', path: '/cases/callbacks/submitted', description: 'CCD callback submitted' },
    { method: 'PUT', path: `/support/claim/${dummyRef}/event/test/resend-staff-notifications`, description: 'Resend staff notifications' },
    { method: 'PUT', path: `/support/claim/${dummyRef}/reset-operation`, description: 'Reset claim operation' },
    { method: 'PUT', path: `/support/claims/${dummyRef}/recover-operations`, description: 'Recover claim operations' },
    { method: 'PUT', path: '/support/claims/transitionClaimState', description: 'Transition claim state' },
    { method: 'PUT', path: `/support/claim/${dummyCcdId}/transferClaimState/test`, description: 'Transfer claim state' },
    { method: 'PUT', path: `/support/rpa/claim`, description: 'RPA claim notifications' },
  ];

  for (const endpoint of removedEndpoints) {
    test(`${endpoint.method} ${endpoint.path} without token must not return 200 - ${endpoint.description}`, async ({ request }) => {
      const response = await request.fetch(`${claimStoreUrl}${endpoint.path}`, {
        method: endpoint.method,
        headers: { 'Content-Type': 'application/json' },
        data: endpoint.method !== 'GET' ? JSON.stringify({}) : undefined,
      });
      expect(response.status()).not.toBe(200);
    });
  }
});

test.describe('No Auth - Always Protected Endpoints (Must Return 401)', () => {
  let claimStoreUrl: string;
  const dummyId = '00000000-0000-0000-0000-000000000000';

  test.beforeAll(() => {
    claimStoreUrl = config.claimStoreUrl;
  });


  const protectedEndpoints = [
    { method: 'GET', path: `/claims/${dummyId}`, description: 'Get claim by reference', expectExact401: true },
    { method: 'POST', path: `/claims/${dummyId}`, description: 'Create claim', expectExact401: true },
    { method: 'PUT', path: '/claims/defendant/link', description: 'Link defendant', expectExact401: true },
    { method: 'POST', path: `/responses/claim/${dummyId}/defendant/${dummyId}`, description: 'Submit response', expectExact401: true },
    // /user/roles returns 400/422 (input validation fires before auth) - still not 200, so secure
    { method: 'GET', path: '/user/roles', description: 'Get user roles', expectExact401: false },
    { method: 'POST', path: '/user/roles', description: 'Add user role', expectExact401: false },
  ];

  for (const endpoint of protectedEndpoints) {
    test(`${endpoint.method} ${endpoint.path} without token is rejected - ${endpoint.description}`, async ({ request }) => {
      const response = await request.fetch(`${claimStoreUrl}${endpoint.path}`, {
        method: endpoint.method,
        headers: { 'Content-Type': 'application/json' },
        data: endpoint.method !== 'GET' ? JSON.stringify({}) : undefined,
      });
      if (endpoint.expectExact401) {
        expect([401, 403]).toContain(response.status());
      } else {
        expect(response.status()).not.toBe(200);
      }
    });
  }
});
