import { expect } from 'chai'
import * as request from 'supertest'

import 'test/routes/expectations'

import { Paths as AppPaths } from 'paths'

import { app } from 'main/app'

import * as idamServiceMock from 'test/http-mocks/idam'
import { getSessionCookie } from 'test/auth-helper'

describe('Home page', () => {
  beforeEach(() => {
    idamServiceMock.resetAuthMocks()
  })

  describe('on GET', () => {
    it('should redirect to start claim page', async () => {
      const sessionCookie = await getSessionCookie(app)

      await request(app)
        .get(AppPaths.homePage.uri)
        .set('Cookie', sessionCookie)
        .expect(res => expect(res).to.be.redirect.toLocation(AppPaths.receiver.uri))
    })
  })
})
