import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'

import 'test/routes/expectations'

import * as idamServiceMock from 'test/http-mocks/idam'

/**
 * Callers must pass getCookie (e.g. () => sessionCookie) so the test runs with the describe's session.
 */
export function checkAuthorizationMiddleware (app: any, method: string, pagePath: string, getCookie: () => string) {
  it('should render page when user session expired', async () => {
    idamServiceMock.resetAuthMocks()
    idamServiceMock.rejectRetrieveUserFor('Response 403 from /details')

    await request(app)[method](pagePath)
      .set('Cookie', getCookie())
      .expect(res => expect(res).to.be.successful)
  })

  it('should render page when user session is active', async () => {
    idamServiceMock.resetAuthMocks()
    idamServiceMock.resolveRetrieveUserFor('1')

    await request(app)[method](pagePath)
      .set('Cookie', getCookie())
      .expect(res => expect(res).to.be.successful)
  })
}
