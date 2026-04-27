/**
 * Test configuration for Playwright tests.
 * All values come from environment variables set by Jenkinsfile_CNP vault secrets.
 * For local runs, export the required env vars before running.
 * See Jenkinsfile_CNP for vault secret names.
 */

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Required environment variable ${name} is not set. Check Jenkinsfile_CNP for vault secret names.`);
  }
  return value;
}

export const config = {
  // Environment
  environment: process.env.ENVIRONMENT || 'preview',
  showBrowserWindow: process.env.SHOW_BROWSER_WINDOW === 'true',
  testHeadless: process.env.TEST_HEADLESS !== 'false',

  // URLs - all from env vars, no hardcoded defaults
  get claimStoreUrl(): string {
    return requireEnv('CLAIM_STORE_URL');
  },
  get idamUrl(): string {
    return process.env.IDAM_URL || requireEnv('IDAM_API_URL');
  },
  get citizenAppUrl(): string {
    return process.env.TEST_URL || requireEnv('CITIZEN_APP_URL');
  },

  // Passwords - from vault secrets
  get defaultPassword(): string {
    return process.env.DEFAULT_PASSWORD || requireEnv('SMOKE_TEST_USER_PASSWORD');
  },

  // OAuth2
  oauth2: {
    clientId: 'cmc_citizen',
    get redirectUri(): string {
      const appUrl = process.env.TEST_URL || process.env.CITIZEN_APP_URL || '';
      return `${appUrl}/receiver`;
    },
    get clientSecret(): string {
      return process.env.OAUTH_CLIENT_SECRET || '';
    },
  },

  // CCD definition
  definition: {
    jurisdiction: 'CMC',
    caseType: 'MoneyClaimCase',
  },
};
