import { expect } from 'chai'
import * as request from 'supertest'

import 'test/routes/expectations'

import * as claimStoreServiceMock from 'test/http-mocks/claim-store'
import { Paths } from 'dashboard/paths'
import { getSessionCookie } from 'test/auth-helper'

export function checkCountyCourtJudgmentRequestedGuard (app: any, method: string, pagePath: string) {
  it(`for ${method} should redirect to your dashboard page when claimant has already requested CCJ`, async () => {
    const sessionCookie = await getSessionCookie(app)
    claimStoreServiceMock.resolveRetrieveClaimByExternalId({ countyCourtJudgmentRequestedAt: '2017-10-10' })

    await request(app)[method](pagePath)
      .set('Cookie', sessionCookie)
      .expect(res => expect(res).to.be.redirect.toLocation(Paths.dashboardPage.uri))
  })
}
