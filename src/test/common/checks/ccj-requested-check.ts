import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'

import 'test/routes/expectations'

import * as claimStoreServiceMock from 'test/http-mocks/claim-store'
import { Paths } from 'dashboard/paths'

import { testAuthCookie } from 'test/auth-helper'

export function checkCountyCourtJudgmentRequestedGuard (app: any, method: string, pagePath: string) {
  it(`for ${method} should redirect to your dashboard page when claimant has already requested CCJ`, async () => {
    claimStoreServiceMock.resolveRetrieveClaimByExternalId({ countyCourtJudgmentRequestedAt: '2017-10-10' })

    await request(app)[method](pagePath)
      .set('Cookie', testAuthCookie())
      .expect(res => expect(res).to.be.redirect.toLocation(Paths.dashboardPage.uri))
  })
}
