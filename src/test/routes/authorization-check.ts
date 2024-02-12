import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'
import * as mock from 'nock'

import 'test/routes/expectations'

import * as idamServiceMock from 'test/http-mocks/idam'

const cookieName: string = config.get<string>('session.cookieName')
export const defaultAccessDeniedPagePattern = new RegExp(`${config.get('idam.authentication-web.url')}/o/authorize\\?response_type=code&state=[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}&client_id=cmc_citizen&redirect_uri=https://127.0.0.1:[0-9]{1,5}/receiver&scope=openid profile roles`)

export function checkAuthorizationGuards (app: any,
                                          method: string,
                                          pagePath: string,
                                          accessDeniedPage: string | RegExp = defaultAccessDeniedPagePattern) {
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
    idamServiceMock.resolveRetrieveUserFor('1', 'divorce-private-beta')

    await request.agent(app)[method](pagePath)
      .set('Cookie', `${cookieName}=ABC`)
      .expect(res => expect(res).redirect.toLocation(accessDeniedPage))
  })
}
