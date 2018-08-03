import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'

import 'test/routes/expectations'

import * as claimStoreServiceMock from 'test/http-mocks/claim-store'
import { Paths } from 'claim/paths'

const cookieName: string = config.get<string>('session.cookieName')

export function featurePermissionAlreadySubmittedGuard (app: any, method: string, pagePath: string, expectedPage: string) {
  it(`for ${method} return 200 and render expected page when user role is found`, async () => {
    claimStoreServiceMock.resolveRetrieveRoleNameByUserIdWhenUserRolePresent()

    await request(app)[method](pagePath)
      .set('Cookie', `${cookieName}=ABC`)
      .expect(res => expect(res).to.be.redirect.toLocation(expectedPage))
  })

  it(`for ${method} redirect to feature opt in page when user role is not found`, async () => {
    claimStoreServiceMock.resolveRetrieveRoleNameByUserIdWhenNoUserRolePresent()

    await request(app)[method](pagePath)
      .set('Cookie', `${cookieName}=ABC`)
      .expect(res => expect(res).to.be.redirect.toLocation(Paths.featurePermissionPage.uri))
  })
}
