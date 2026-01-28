import { expect } from 'chai'
import * as request from 'supertest'

import 'test/routes/expectations'

import { Paths as AppPaths } from 'paths'

import { app } from 'main/app'

import * as idamServiceMock from 'test/http-mocks/idam'
import { attachDefaultHooks } from 'test/routes/hooks'
import { getSessionCookie } from 'test/auth-helper'

describe('Logout receiver', () => {
  attachDefaultHooks(app)

  beforeEach(() => {
    idamServiceMock.resetAuthMocks()
  })

  describe('on GET', () => {
    it('should redirect to idam endSession and clear session when user had session', async () => {
      const sessionCookie = await getSessionCookie(app)

      const res = await request(app)
        .get(AppPaths.logoutReceiver.uri)
        .set('Cookie', sessionCookie)
        .expect(302)

      expect(res.header['location']).to.match(/\/o\/endSession/)
    })

    it('should redirect to idam endSession even when session invalidation fails', async () => {
      const sessionCookie = await getSessionCookie(app)

      const res = await request(app)
        .get(AppPaths.logoutReceiver.uri)
        .set('Cookie', sessionCookie)
        .expect(302)

      expect(res.header['location']).to.match(/\/o\/endSession/)
    })

    it('should redirect to idam endSession when session cookie is missing', async () => {
      await request(app)
        .get(AppPaths.logoutReceiver.uri)
        .set('Cookie', null)
        .expect(res => expect(res).to.be.redirect.toLocation(/.*\/o\/endSession.*/))
    })

    it('should redirect to idam endSession endpoint', async () => {
      await request(app)
        .get(AppPaths.logoutReceiver.uri)
        .set('Cookie', null)
        .expect(res => expect(res).to.be.redirect.toLocation(/.*\/o\/endSession.*/))
    })
  })
})
