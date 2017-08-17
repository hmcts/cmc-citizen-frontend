import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'
import * as mock from 'nock'

import './expectations'

import * as idamServiceMock from '../http-mocks/idam'

const cookieName: string = config.get<string>('session.cookieName')

export function checkAuthorizationGuards (app: any, method: string, pagePath: string, accessDeniedPage: string | RegExp) {
  it('should redirect to access denied page when JWT token is missing', async () => {
    await request(app)[method](pagePath)
      .expect(res => expect(res).redirect.toLocation(accessDeniedPage))
  })

  it('should redirect to access denied page when cannot retrieve user details (possibly session expired)', async () => {
    mock.cleanAll()
    idamServiceMock.rejectRetrieveUserFor('Response 403 from /details')

    await request(app)[method](pagePath)
      .set('Cookie', `${cookieName}=ABC`)
      .expect(res => expect(res).redirect.toLocation(accessDeniedPage))
  })

  it('should redirect to access denied page when user not in required role', async () => {
    mock.cleanAll()
    idamServiceMock.resolveRetrieveUserFor(1, 'cmc-private-beta')

    await request.agent(app)[method](pagePath)
      .set('Cookie', `${cookieName}=ABC`)
      .expect(res => expect(res).redirect.toLocation(accessDeniedPage))
  })
}
