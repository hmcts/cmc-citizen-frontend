import { test, expect } from '@playwright/test';
import { config } from '../../helpers/env-config';

/**
 * Path Traversal: Attempts to bypass URL filters using encoded characters,
 * double slashes, null bytes, and semicolons must not return 200.
 *
 * Based on DTSCCI-4008 Attack Category #8.
 */
test.describe('Path Traversal - Must Not Return 200', () => {
  let claimStoreUrl: string;

  test.beforeAll(() => {
    claimStoreUrl = config.claimStoreUrl;
  });


  const traversalPaths = [
    { path: '/claims/../actuator/env', description: 'dot-dot to actuator/env' },
    { path: '/claims/../../etc/passwd', description: 'dot-dot to /etc/passwd' },
    { path: '/claims/%2e%2e%2factuator/env', description: 'URL-encoded dot-dot' },
    { path: '/claims/%2e%2e/%2e%2e/actuator/env', description: 'double URL-encoded dot-dot' },
    { path: '/claims/..%252f..%252factuator/env', description: 'double-encoded slash' },
    { path: '/claims//actuator/env', description: 'double slash' },
    { path: '/CLAIMS/../actuator/env', description: 'uppercase path' },
    { path: '/claims%00/actuator/env', description: 'null byte injection' },
    { path: '/claims;/actuator/env', description: 'semicolon path parameter' },
  ];

  for (const traversal of traversalPaths) {
    test(`GET ${traversal.path} must not return 200 - ${traversal.description}`, async ({ request }) => {
      const response = await request.get(`${claimStoreUrl}${traversal.path}`, {
        headers: { 'Content-Type': 'application/json' },
      });
      expect(response.status()).not.toBe(200);
    });
  }
});
