import { test, expect } from '@playwright/test';
import { config } from '../../helpers/env-config';
import { createFakeJwt, createRoleEscalationJwt } from '../../helpers/jwt-helper';

/**
 * Fake JWT: Protected endpoints must reject fabricated JWTs with fake signatures.
 * A structurally valid JWT that wasn't signed by IDAM must be rejected.
 *
 * Based on DTSCCI-4008 Attack Category #4 (Fake JWT) and #7 (Role Escalation).
 */
test.describe('Fake JWT - Forged Token Must Be Rejected', () => {
  let claimStoreUrl: string;
  const fakeToken = createFakeJwt();
  const dummyId = '00000000-0000-0000-0000-000000000000';

  test.beforeAll(() => {
    claimStoreUrl = config.claimStoreUrl;
  });


  const endpoints = [
    { method: 'GET', path: `/claims/${dummyId}`, description: 'Get claim' },
    { method: 'POST', path: `/claims/${dummyId}`, description: 'Create claim' },
    { method: 'PUT', path: '/claims/defendant/link', description: 'Link defendant' },
    { method: 'POST', path: `/responses/claim/${dummyId}/defendant/${dummyId}`, description: 'Submit response' },
  ];

  for (const endpoint of endpoints) {
    test(`${endpoint.method} ${endpoint.path} with fake JWT returns 401 - ${endpoint.description}`, async ({ request }) => {
      const response = await request.fetch(`${claimStoreUrl}${endpoint.path}`, {
        method: endpoint.method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${fakeToken}`,
        },
        data: endpoint.method !== 'GET' ? JSON.stringify({}) : undefined,
      });
      expect([401, 403]).toContain(response.status());
    });
  }

  // /user/roles returns 422 with fake token (input validation before auth) - still not 200
  test('POST /user/roles with fake JWT is rejected', async ({ request }) => {
    const response = await request.fetch(`${claimStoreUrl}/user/roles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${fakeToken}`,
      },
      data: JSON.stringify({}),
    });
    expect(response.status()).not.toBe(200);
  });
});

test.describe('Role Escalation - Forged Caseworker/Admin Token Must Be Rejected', () => {
  let claimStoreUrl: string;
  const escalatedToken = createRoleEscalationJwt();

  test.beforeAll(() => {
    claimStoreUrl = config.claimStoreUrl;
  });


  const endpoints = [
    { method: 'PUT', path: '/support/claims/transitionClaimState', description: 'Transition state (admin)' },
    { method: 'PUT', path: '/support/rpa/claim', description: 'RPA notifications (admin)' },
    { method: 'POST', path: '/cases/callbacks/about-to-start', description: 'CCD callback (caseworker)' },
  ];

  for (const endpoint of endpoints) {
    test(`${endpoint.method} ${endpoint.path} with escalated role JWT must not return 200`, async ({ request }) => {
      const response = await request.fetch(`${claimStoreUrl}${endpoint.path}`, {
        method: endpoint.method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${escalatedToken}`,
        },
        data: JSON.stringify({}),
      });
      expect(response.status()).not.toBe(200);
    });
  }
});
