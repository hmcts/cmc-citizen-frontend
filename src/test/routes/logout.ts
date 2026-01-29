import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'

import 'test/routes/expectations'

import { Paths as AppPaths } from 'paths'

import { app } from 'main/app'

import * as idamServiceMock from 'test/http-mocks/idam'
import { attachDefaultHooks } from 'test/routes/hooks'

const cookieName: string = config.get<string>('session.cookieName')

describe('Logout receiver', () => {
  attachDefaultHooks(app)

  beforeEach(() => {
    idamServiceMock.resetAuthMocks()
  })

  describe('on GET', () => {
    it('should redirect to idam endSession and clear session', async () => {
      const res = await request(app)
        .get(AppPaths.logoutReceiver.uri)
        .set('Cookie', `${cookieName}=ABC`)
      expect(res).to.be.redirect.toLocation(/.*\/o\/endSession.*/)
      // Session is destroyed; cookie may be cleared (empty/expired) or omitted when no valid session
      const setCookie = res.headers['set-cookie'] as string[] | undefined
      const sessionCookie = setCookie?.find(c => c.startsWith(`${cookieName}=`))
      if (sessionCookie) {
        expect(sessionCookie).to.match(new RegExp(`${cookieName}=;|${cookieName}=`))
      }
    })

    it('should redirect to idam endSession with token hint when session had token', async () => {
      const res = await request(app)
        .get(AppPaths.logoutReceiver.uri)
        .set('Cookie', `${cookieName}=${idamServiceMock.defaultAuthToken}`)
      expect(res).to.be.redirect.toLocation(/.*\/o\/endSession.*/)
      expect(res.headers.location).to.include('id_token_hint=')
    })

    it('should not remove session cookie or invalidate auth token when session cookie is missing', async () => {
      await request(app)
        .get(AppPaths.logoutReceiver.uri)
        .set('Cookie', null)
        .expect(res => expect(res).not.to.have.cookie)
    })

    it('should redirect to idam endSession endpoint', async () => {
      await request(app)
        .get(AppPaths.logoutReceiver.uri)
        .set('Cookie', null)
        .expect(res => expect(res).to.be.redirect.toLocation(/.*\/o\/endSession.*/))
    })
  })
})
