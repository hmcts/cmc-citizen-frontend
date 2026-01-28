import * as config from 'config'
import * as request from 'supertest'
import { Paths as AppPaths } from 'paths'
import * as idamServiceMock from 'test/http-mocks/idam'

const sessionName: string = config.has('session.name')
  ? config.get<string>('session.name')
  : 'cmc-citizen-ui-session'

export interface SessionCookieOptions {
  token?: string
  state?: string
  userId?: string
  roles?: string[]
}

/**
 * Obtains a session cookie by performing a fake OAuth callback (GET /receiver?code=...&state=...).
 * Use this instead of setting a JWT cookie: the app now stores the token in the server-side session
 * and only sends a session id in the cookie.
 *
 * Usage:
 *   const sessionCookie = await getSessionCookie(app)
 *   await request(app).get(protectedPath).set('Cookie', sessionCookie)
 */
export async function getSessionCookie (
  app: any,
  options: SessionCookieOptions = {}
): Promise<string> {
  const token = options.token ?? idamServiceMock.defaultAuthToken
  const state = options.state ?? `test-state-${Date.now()}`
  const userId = options.userId ?? '1'
  const roles = options.roles ?? ['citizen']

  idamServiceMock.resolveExchangeCode(token)
  const userInfoScope = idamServiceMock.resolveRetrieveUserFor(userId, ...roles)
  if (userInfoScope && typeof (userInfoScope as any).persist === 'function') {
    (userInfoScope as any).persist()
  }

  const res = await request(app)
    .get(`${AppPaths.receiver.uri}?code=test&state=${encodeURIComponent(state)}`)
    .set('Cookie', `state=${state}`)
    .expect(302)

  const setCookies = res.headers['set-cookie']
  if (!setCookies || !Array.isArray(setCookies)) {
    throw new Error('Expected Set-Cookie header from receiver')
  }

  const sessionCookieHeader = setCookies.find((c: string) =>
    c.startsWith(`${sessionName}=`)
  )
  if (!sessionCookieHeader) {
    throw new Error(`Expected session cookie ${sessionName} in Set-Cookie`)
  }

  const valueMatch = sessionCookieHeader.match(/^([^=]+)=([^;]+)/)
  if (!valueMatch) {
    throw new Error('Could not parse session cookie')
  }
  return `${valueMatch[1]}=${valueMatch[2]}`
}

/**
 * Session cookie name (session id cookie), for assertions.
 * Use config session.name; kept for tests that assert cookie name.
 */
export function getSessionCookieName (): string {
  return sessionName
}
