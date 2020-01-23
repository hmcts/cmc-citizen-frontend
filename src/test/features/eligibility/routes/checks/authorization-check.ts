import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'
import * as mock from 'nock'

import 'test/routes/expectations'

import * as idamServiceMock from 'test/http-mocks/idam'

const cookieName: string = config.get<string>('session.cookieName')

export function checkAuthorizationMiddleware (app: any, method: string, pagePath: string) {
  it('should render page when user session expired', async () => {
    mock.cleanAll()
    idamServiceMock.rejectRetrieveUserFor('Response 403 from /details')

    await request(app)[method](pagePath)
      .set('Cookie', `${cookieName}=ABC`)
      .expect(res => expect(res).to.be.successful)
  })

  it('should render page when user session is active', async () => {
    mock.cleanAll()
    idamServiceMock.resolveRetrieveUserFor('1')

    await request(app)[method](pagePath)
      .set('Cookie', `${cookieName}=ABC`)
      .expect(res => expect(res).to.be.successful)
  })
}
