/**
 * JWT utility for crafting malicious tokens used in security tests.
 * No external dependencies - uses base64url encoding manually.
 */

function base64url(data: string): string {
  return Buffer.from(data).toString('base64url');
}

function buildJwt(header: object, payload: object, signature: string = ''): string {
  const encodedHeader = base64url(JSON.stringify(header));
  const encodedPayload = base64url(JSON.stringify(payload));
  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

const defaultPayload = {
  sub: 'fake-user-id-12345',
  iat: Math.floor(Date.now() / 1000),
  exp: Math.floor(Date.now() / 1000) + 3600,
  tokenName: 'access_token',
  aud: 'cmc_citizen',
  roles: ['citizen'],
};

/**
 * Creates a structurally valid JWT signed with a fake secret.
 * The signature is valid base64url but won't verify against IDAM's keys.
 */
export function createFakeJwt(): string {
  const header = { alg: 'HS256', typ: 'JWT' };
  const fakeSignature = base64url('this-is-a-fake-signature-that-will-not-verify');
  return buildJwt(header, defaultPayload, fakeSignature);
}

/**
 * Classic JWT bypass - set alg to "none" and remove signature.
 * A vulnerable server might accept this as valid.
 */
export function createAlgNoneJwt(): string {
  const header = { alg: 'none', typ: 'JWT' };
  return buildJwt(header, defaultPayload, '');
}

/**
 * Creates a JWT with exp timestamp in the past (expired 1 hour ago).
 */
export function createExpiredJwt(): string {
  const header = { alg: 'HS256', typ: 'JWT' };
  const payload = {
    ...defaultPayload,
    exp: Math.floor(Date.now() / 1000) - 3600,
    iat: Math.floor(Date.now() / 1000) - 7200,
  };
  const fakeSignature = base64url('expired-token-signature');
  return buildJwt(header, payload, fakeSignature);
}

/**
 * Creates a JWT claiming elevated roles (caseworker, admin, judge).
 * Tests that role escalation via forged tokens is rejected.
 */
export function createRoleEscalationJwt(): string {
  const header = { alg: 'HS256', typ: 'JWT' };
  const payload = {
    ...defaultPayload,
    roles: ['caseworker', 'caseworker-cmc', 'caseworker-cmc-judge', 'admin'],
  };
  const fakeSignature = base64url('role-escalation-signature');
  return buildJwt(header, payload, fakeSignature);
}
