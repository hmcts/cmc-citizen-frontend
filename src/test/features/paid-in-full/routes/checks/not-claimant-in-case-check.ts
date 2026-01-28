import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'

import 'test/routes/expectations'

import * as claimStoreServiceMock from 'test/http-mocks/claim-store'
import * as idamServiceMock from 'test/http-mocks/idam'

/**
 * Callers must pass getCookie (e.g. () => sessionCookie) so the test runs with the describe's session.
 */
export function checkNotClaimantInCaseGuard (app: any, method: string, pagePath: string, getCookie: () => string) {
  it(`for ${method} should return 403 and render forbidden error page not claimant in case`, async () => {
    claimStoreServiceMock.resolveRetrieveClaimByExternalId()
    idamServiceMock.resolveRetrieveUserFor('4', 'citizen')

    await request(app)[method](pagePath)
      .set('Cookie', getCookie())
      .expect(res => expect(res).to.be.forbidden.withText('Forbidden'))
  })
}
