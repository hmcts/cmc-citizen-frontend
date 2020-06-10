import * as claimStoreServiceMock from 'test/http-mocks/claim-store'
import 'test/routes/expectations'
import { MomentFactory } from 'shared/momentFactory'
import * as request from 'supertest'
import { app } from 'main/app'
import { expect } from 'chai'
import { Paths as DashboardPaths } from 'dashboard/paths'
import * as config from 'config'

const cookieName: string = config.get<string>('session.cookieName')

export function verifyRedirectForGetWhenAlreadyPaidInFull (pagePath: string, claimOverride: any = {}) {
  it('should redirect to claim status when claimant declared paid in full', async () => {
    claimStoreServiceMock.resolveRetrieveClaimByExternalId({
      ...claimOverride,
      moneyReceivedOn: MomentFactory.currentDate()
    })
    const externalId = claimStoreServiceMock.sampleClaimObj.externalId

    await request(app)
      .get(pagePath)
      .set('Cookie', `${cookieName}=ABC`)
      .expect(res => expect(res).to.be.redirect.toLocation(DashboardPaths.defendantPage
        .evaluateUri({ externalId })))
  })
}

export function verifyRedirectForPostWhenAlreadyPaidInFull (pagePath: string, claimOverride: any = {}, postBody: any = {}) {
  it('should redirect to claim status when claimant declared paid in full', async () => {
    claimStoreServiceMock.resolveRetrieveClaimByExternalId({
      ...claimOverride,
      moneyReceivedOn: MomentFactory.currentDate()
    })
    const externalId = claimStoreServiceMock.sampleClaimObj.externalId

    await request(app)
      .post(pagePath)
      .set('Cookie', `${cookieName}=ABC`)
      .send(postBody)
      .expect(res => expect(res).to.be.redirect.toLocation(DashboardPaths.defendantPage
        .evaluateUri({ externalId })))
  })
}
