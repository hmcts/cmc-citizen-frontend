import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'
import * as mock from 'nock'

import 'test/routes/expectations'

import { Paths as AppPaths } from 'paths'

import { app } from 'main/app'

import * as idamServiceMock from 'test/http-mocks/idam'

import { testAuthCookie } from 'test/auth-helper'

describe('Home page', () => {
  beforeEach(() => {
    mock.cleanAll()
  })

  describe('on GET', () => {
    it('should redirect to start claim page', async () => {
      idamServiceMock.resolveRetrieveUserFor('1', 'citizen')

      await request(app)
        .get(AppPaths.homePage.uri)
        .set('Cookie', testAuthCookie())
        .expect(res => expect(res).to.be.redirect.toLocation(AppPaths.receiver.uri))
    })
  })
})
