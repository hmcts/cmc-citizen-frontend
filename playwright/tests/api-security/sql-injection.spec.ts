import { test, expect } from '@playwright/test';
import { config } from '../../helpers/env-config';

/**
 * SQL Injection: Malicious SQL payloads injected into URL path parameters
 * must not cause a 500 Internal Server Error (indicates unhandled SQL).
 *
 * Based on DTSCCI-4008 Attack Category #11.
 */
test.describe('SQL Injection - Malicious Payloads Must Not Cause 500', () => {
  let claimStoreUrl: string;

  test.beforeAll(() => {
    claimStoreUrl = config.claimStoreUrl;
  });

  const sqlPayloads = [
    { path: "/claims/' OR '1'='1", description: 'Basic OR 1=1' },
    { path: "/claims/1; DROP TABLE claims;--", description: 'DROP TABLE attempt' },
    { path: "/claims/' UNION SELECT * FROM users--", description: 'UNION SELECT' },
    { path: "/claims/1' AND 1=CONVERT(int,(SELECT TOP 1 table_name FROM information_schema.tables))--", description: 'Information schema extraction' },
    { path: "/claims/' OR 1=1; WAITFOR DELAY '0:0:5'--", description: 'Time-based blind SQLi' },
    { path: "/claims/1%27%20OR%20%271%27%3D%271", description: 'URL-encoded OR 1=1' },
    { path: "/claims/' OR ''='", description: 'Empty string comparison' },
    { path: "/claims/1; EXEC xp_cmdshell('whoami')--", description: 'Command execution via xp_cmdshell' },
    { path: "/claims/' HAVING 1=1--", description: 'HAVING clause injection' },
    { path: "/claims/' ORDER BY 100--", description: 'ORDER BY column enumeration' },
  ];

  for (const payload of sqlPayloads) {
    test(`GET ${payload.description} must not return 500`, async ({ request }) => {
      const response = await request.get(`${claimStoreUrl}${payload.path}`, {
        headers: { 'Content-Type': 'application/json' },
      });
      expect(response.status()).not.toBe(500);
    });
  }
});
