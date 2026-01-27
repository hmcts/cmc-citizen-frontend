import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'
import * as mock from 'nock'

import 'test/routes/expectations'

import * as idamServiceMock from 'test/http-mocks/idam'

import { testAuthCookie } from 'test/auth-helper'

export function checkAuthorizationMiddleware (app: any, method: string, pagePath: string) {
  it('should render page when user session expired', async () => {
    mock.cleanAll()
    idamServiceMock.rejectRetrieveUserFor('Response 403 from /details')

    await request(app)[method](pagePath)
      .set('Cookie', testAuthCookie())
      .expect(res => expect(res).to.be.successful)
  })

  it('should render page when user session is active', async () => {
    mock.cleanAll()
    idamServiceMock.resolveRetrieveUserFor('1')

    await request(app)[method](pagePath)
      .set('Cookie', testAuthCookie())
      .expect(res => expect(res).to.be.successful)
  })
}
