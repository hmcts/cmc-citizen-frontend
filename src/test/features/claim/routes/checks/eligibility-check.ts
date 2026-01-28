import { expect } from 'chai'
import * as config from 'config'
import * as request from 'supertest'

import { Paths } from 'eligibility/paths'

import * as idamServiceMock from 'test/http-mocks/idam'
import { getSessionCookie } from 'test/auth-helper'
import * as draftStoreServiceMock from 'test/http-mocks/draft-store'

let sessionCookie: string
  beforeEach(async () => {
    sessionCookie = await getSessionCookie(app)
  })


export function checkEligibilityGuards (app: any, method: string, pagePath: string) {
  it('should redirect to eligibility start page when draft is not marked eligible', async () => {
    idamServiceMock.resetAuthMocks()
    idamServiceMock.resolveRetrieveUserFor('1', 'citizen')
    draftStoreServiceMock.resolveFind('claim', { eligibility: undefined })

    await request(app)[method](pagePath)
      .set('Cookie', sessionCookie)
      .expect(res => expect(res).redirect.toLocation(Paths.startPage.uri))
  })
}
