import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'
import 'test/routes/expectations'
import * as idamServiceMock from 'test/http-mocks/idam'
import { getSessionCookie } from 'test/auth-helper'

export const defaultAccessDeniedPagePattern = new RegExp(`${config.get('idam.authentication-web.url')}/o/authorize\\?response_type=code&state=(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?&client_id=cmc_citizen&redirect_uri=https://127.0.0.1:[0-9]{1,5}/receiver&scope=openid%20profile%20roles`)

export interface AuthorizationGuardOptions {
  /** When true, accept 404 as well as 302 for unauthenticated requests (e.g. routes that return 404 when not logged in). */
  accept404WhenTokenMissing?: boolean
  /** When true, only add the "JWT missing" test; skip the two tests that need getSessionCookie (e.g. when receiver returns 404 in that suite). */
  skipSessionDependentTests?: boolean
}

export function checkAuthorizationGuards (app: any,
                                          method: string,
                                          pagePath: string,
                                          accessDeniedPage: string | RegExp = defaultAccessDeniedPagePattern,
                                          options: AuthorizationGuardOptions = {}) {
  it('should redirect to access denied page when JWT token is missing', async () => {
    const res = await request(app)[method](pagePath)
    if (options.accept404WhenTokenMissing && res.status === 404) {
      expect(res.status).to.equal(404)
    } else {
      expect(res).redirect.toLocation(accessDeniedPage)
    }
  })

  if (!options.skipSessionDependentTests) {
    it('should redirect to access denied page when cannot retrieve user details (possibly session expired)', async () => {
      const sessionCookie = await getSessionCookie(app)
      idamServiceMock.resetAuthMocks()
      idamServiceMock.rejectRetrieveUserFor('Response 403 from /details')
      await request(app)[method](pagePath)
        .set('Cookie', sessionCookie)
        .expect(res => expect(res).redirect.toLocation(accessDeniedPage))
    })

    it('should redirect to access denied page when user not in required role', async () => {
      const sessionCookie = await getSessionCookie(app, { roles: ['divorce-private-beta'] })
      idamServiceMock.resetAuthMocks()
      idamServiceMock.resolveRetrieveUserFor('1', 'divorce-private-beta')
      await request.agent(app)[method](pagePath)
        .set('Cookie', sessionCookie)
        .expect(res => expect(res).redirect.toLocation(accessDeniedPage))
    })
  }
}
