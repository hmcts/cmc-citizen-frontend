import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'

import '../../../../routes/expectations'

import * as claimStoreServiceMock from '../../../../http-mocks/claim-store'
import { Paths } from 'dashboard/paths'

const cookieName: string = config.get<string>('session.cookieName')

export function checkCountyCourtJudgmentRequestedGuardGuard (app: any, method: string, pagePath: string) {
  it(`for ${method} should redirect to your dashboard page when defendant has already responded`, async () => {
    claimStoreServiceMock.resolveRetrieveClaimByExternalId({ countyCourtJudgmentRequestedAt: '2017-10-10' })

    await request(app)[method](pagePath)
      .set('Cookie', `${cookieName}=ABC`)
      .expect(res => expect(res).to.be.redirect.toLocation(Paths.dashboardPage.uri))
  })
}
