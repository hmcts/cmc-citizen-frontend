import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'

import 'test/routes/expectations'

import * as claimStoreServiceMock from 'test/http-mocks/claim-store'
import { Paths } from 'dashboard/paths'

const cookieName: string = config.get<string>('session.cookieName')

export function checkAlreadySubmittedGuard (app: any, method: string, pagePath: string) {
  it('should return 500 and render error page when cannot retrieve claim in guard', async () => {
    claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error')

    await request(app)[method](pagePath)
      .set('Cookie', `${cookieName}=ABC`)
      .expect(res => expect(res).to.be.serverError.withText('Error'))
  })

  it('should redirect to your dashboard page when defendant has already responded', async () => {
    claimStoreServiceMock.resolveRetrieveClaimByExternalIdWithResponse()

    await request(app)[method](pagePath)
      .set('Cookie', `${cookieName}=ABC`)
      .expect(res => expect(res).to.be.redirect.toLocation(Paths.dashboardPage.uri))
  })
}
