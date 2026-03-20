import { test, expect } from '@playwright/test';
import { config } from '../../helpers/env-config';

/**
 * XSS (Reflected): Script injection payloads in URL path parameters
 * must not be reflected back in the response body.
 *
 * Based on DTSCCI-4008 Attack Category #12.
 */
test.describe('XSS - Script Injection Must Not Be Reflected', () => {
  let claimStoreUrl: string;

  test.beforeAll(() => {
    claimStoreUrl = config.claimStoreUrl;
  });

  const xssPayloads = [
    { path: '/claims/<script>alert(1)</script>', marker: '<script>', description: 'Basic script tag' },
    { path: '/claims/"><img src=x onerror=alert(1)>', marker: 'onerror', description: 'IMG tag with onerror' },
    { path: '/claims/%3Cscript%3Ealert(1)%3C/script%3E', marker: '<script>', description: 'URL-encoded script tag' },
    { path: "/claims/javascript:alert('XSS')", marker: "javascript:", description: 'Javascript protocol' },
  ];

  for (const payload of xssPayloads) {
    test(`GET ${payload.description} must not be reflected in response`, async ({ request }) => {
      const response = await request.get(`${claimStoreUrl}${payload.path}`, {
        headers: { 'Content-Type': 'application/json' },
      });
      const body = await response.text();
      expect(body).not.toContain(payload.marker);
    });
  }
});
