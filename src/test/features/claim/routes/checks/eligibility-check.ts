import { expect } from 'chai'
import * as config from 'config'
import * as mock from 'nock'
import * as request from 'supertest'

import { Paths } from 'eligibility/paths'

import * as idamServiceMock from 'test/http-mocks/idam'
import * as draftStoreServiceMock from 'test/http-mocks/draft-store'

import { testAuthCookie } from 'test/auth-helper'

export function checkEligibilityGuards (app: any, method: string, pagePath: string) {
  it('should redirect to eligibility start page when draft is not marked eligible', async () => {
    mock.cleanAll()
    idamServiceMock.resolveRetrieveUserFor('1', 'citizen')
    idamServiceMock.resolveRetrieveServiceToken()
    draftStoreServiceMock.resolveFind('claim', { eligibility: undefined })

    await request(app)[method](pagePath)
      .set('Cookie', testAuthCookie())
      .expect(res => expect(res).redirect.toLocation(Paths.startPage.uri))
  })
}
