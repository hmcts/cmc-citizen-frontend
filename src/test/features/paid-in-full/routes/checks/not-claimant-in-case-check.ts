import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'

import 'test/routes/expectations'

import * as claimStoreServiceMock from 'test/http-mocks/claim-store'
import * as idamServiceMock from 'test/http-mocks/idam'

import { testAuthCookie } from 'test/auth-helper'

export function checkNotClaimantInCaseGuard (app: any, method: string, pagePath: string) {
  it(`for ${method} should return 403 and render forbidden error page not claimant in case`, async () => {
    claimStoreServiceMock.resolveRetrieveClaimByExternalId()
    idamServiceMock.resolveRetrieveUserFor('4', 'citizen')

    await request(app)[method](pagePath)
      .set('Cookie', testAuthCookie())
      .expect(res => expect(res).to.be.forbidden.withText('Forbidden'))
  })
}
