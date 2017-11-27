import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'

import '../../../../routes/expectations'

import * as claimStoreServiceMock from '../../../../http-mocks/claim-store'
import * as idamServiceMock from '../../../../http-mocks/idam'

const cookieName: string = config.get<string>('session.cookieName')

export function checkNotDefendantInCaseGuard (app: any, method: string, pagePath: string) {
  it(`for ${method} should return 403 and render forbidden error page not defendant in case`, async () => {
    claimStoreServiceMock.resolveRetrieveClaimByExternalId()
    idamServiceMock.resolveRetrieveUserFor('2', 'cmc-private-beta')

    await request(app)[method](pagePath)
      .set('Cookie', `${cookieName}=ABC`)
      .expect(res => expect(res).to.be.forbidden.withText('Forbidden'))
  })
}
