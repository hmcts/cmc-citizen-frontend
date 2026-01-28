import { expect } from 'chai'
import * as request from 'supertest'

import 'test/routes/expectations'

import * as claimStoreServiceMock from 'test/http-mocks/claim-store'
import * as idamServiceMock from 'test/http-mocks/idam'
import { getSessionCookie } from 'test/auth-helper'

export function checkNotDefendantInCaseGuard (app: any, method: string, pagePath: string) {
  it(`for ${method} should return 403 and render forbidden error page not defendant in case`, async () => {
    const sessionCookie = await getSessionCookie(app, { userId: '2' })
    claimStoreServiceMock.resolveRetrieveClaimByExternalId()
    idamServiceMock.resolveRetrieveUserFor('2', 'citizen')

    await request(app)[method](pagePath)
      .set('Cookie', sessionCookie)
      .expect(res => expect(res).to.be.forbidden.withText('Forbidden'))
  })
}
