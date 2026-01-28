import { expect } from 'chai'
import * as config from 'config'
import * as request from 'supertest'

import { Paths } from 'eligibility/paths'

import * as idamServiceMock from 'test/http-mocks/idam'
import * as draftStoreServiceMock from 'test/http-mocks/draft-store'

/**
 * Callers must pass getCookie (e.g. () => sessionCookie) so the test runs with the describe's session.
 */
export function checkEligibilityGuards (app: any, method: string, pagePath: string, getCookie: () => string) {
  it('should redirect to eligibility start page when draft is not marked eligible', async () => {
    idamServiceMock.resetAuthMocks()
    idamServiceMock.resolveRetrieveUserFor('1', 'citizen')
    draftStoreServiceMock.resolveFind('claim', { eligibility: undefined })

    await request(app)[method](pagePath)
      .set('Cookie', getCookie())
      .expect(res => expect(res).redirect.toLocation(Paths.startPage.uri))
  })
}
