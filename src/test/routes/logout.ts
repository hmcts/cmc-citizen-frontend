import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'
import * as mock from 'nock'

import 'test/routes/expectations'

import { Paths as AppPaths } from 'paths'

import { app } from 'main/app'

import * as idamServiceMock from 'test/http-mocks/idam'
import { attachDefaultHooks } from 'test/routes/hooks'
import { testAuthCookie } from 'test/auth-helper'

const sessionCookieName: string = config.has('session.name') ? config.get<string>('session.name') : 'cmc-citizen-ui-session'

describe('Logout receiver', () => {
  attachDefaultHooks(app)

  beforeEach(() => {
    mock.cleanAll()
  })

  describe('on GET', () => {
    it('should destroy session and clear session cookie', async () => {
      await request(app)
        .get(AppPaths.logoutReceiver.uri)
        .set('Cookie', testAuthCookie())
        .expect(res => expect(res).to.have.cookie(sessionCookieName, ''))
    })

    it('should destroy session and clear session cookie even when idam session invalidation fails', async () => {
      await request(app)
        .get(AppPaths.logoutReceiver.uri)
        .set('Cookie', testAuthCookie(idamServiceMock.defaultAuthToken))
        .expect(res => expect(res).to.have.cookie(sessionCookieName, ''))
    })

    it('should redirect to idam when no session present', async () => {
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
