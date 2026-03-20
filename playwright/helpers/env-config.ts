/**
 * Test configuration for Playwright tests.
 * Follows the same pattern as:
 *   - civil-citizen-ui/src/test/config.js
 *   - cmc-ccd-e2e-tests/playwright/config/config.ts + urls.ts + users.ts
 *
 * All env vars are set in Jenkinsfile_CNP vault secrets for CI.
 * For local runs, export them before running (see env vars listed below).
 */

const defaultPassword = process.env.DEFAULT_PASSWORD || process.env.SMOKE_TEST_USER_PASSWORD || 'Password12!';
const citizenPassword = process.env.CLAIMANT_CITIZEN_PASSWORD || defaultPassword;
const judgePassword = process.env.JUDGE_PASSWORD || process.env.JUDGE_DEFAULT_PASSWORD || 'Hmcts1234';

export const config = {
  // Environment
  environment: process.env.ENVIRONMENT || 'preview',
  showBrowserWindow: process.env.SHOW_BROWSER_WINDOW === 'true',
  testHeadless: process.env.TEST_HEADLESS !== 'false',

  // URLs - same pattern as cmc-ccd-e2e-tests/playwright/config/urls.ts
  get claimStoreUrl(): string {
    return process.env.CLAIM_STORE_URL || 'http://cmc-claim-store-aat.service.core-compute-aat.internal';
  },
  get idamUrl(): string {
    return process.env.IDAM_URL || process.env.IDAM_API_URL || 'https://idam-api.aat.platform.hmcts.net';
  },
  get citizenAppUrl(): string {
    return process.env.TEST_URL || process.env.CITIZEN_APP_URL || 'https://moneyclaims.aat.platform.hmcts.net';
  },
  get s2sUrl(): string {
    return process.env.SERVICE_AUTH_PROVIDER_API_BASE_URL || 'http://rpe-service-auth-provider-aat.service.core-compute-aat.internal';
  },

  // Passwords
  get defaultPassword(): string {
    return defaultPassword;
  },
  get citizenPassword(): string {
    return citizenPassword;
  },
  get judgePassword(): string {
    return judgePassword;
  },

  // OAuth2 - same as idamClient.ts:16-20
  oauth2: {
    clientId: 'cmc_citizen',
    get redirectUri(): string {
      const appUrl = process.env.TEST_URL || process.env.CITIZEN_APP_URL || 'https://localhost:3000';
      return `${appUrl}/receiver`;
    },
    get clientSecret(): string {
      return process.env.OAUTH_CLIENT_SECRET || '';
    },
  },

  // S2S - same as cmc-ccd-e2e-tests/playwright/config/config.ts:16-18
  s2s: {
    microservice: process.env.S2S_MICROSERVICE_KEY_CMC || 'cmc_citizen',
    get secret(): string {
      return process.env.S2S_SECRET || process.env.S2S_MICROSERVICE_KEY_PWD || '';
    },
  },

  // Users - same pattern as civil-citizen-ui/src/test/config.js
  claimantCitizenUser: {
    get email(): string {
      return process.env.CITIZEN_USERNAME || process.env.SMOKE_TEST_CITIZEN_USERNAME || '';
    },
    get password(): string {
      return citizenPassword;
    },
  },

  // CCD definition
  definition: {
    jurisdiction: 'CMC',
    caseType: 'MoneyClaimCase',
  },
};
