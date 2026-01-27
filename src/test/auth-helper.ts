/**
 * Test-only auth helper for session-based auth.
 * When NODE_ENV=mocha, the app injects req.session.user when this cookie is present.
 * Use testAuthCookie() to simulate a logged-in user in route tests.
 */
export const TEST_AUTH_COOKIE_NAME = 'TEST_AUTH_TOKEN'

export function testAuthCookie (token: string = 'ABC'): string {
  return `${TEST_AUTH_COOKIE_NAME}=${token}`
}
