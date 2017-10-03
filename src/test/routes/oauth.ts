import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'
import './expectations'

import { Paths as AppPaths } from 'app/paths'

import { app } from '../../main/app'

import * as idamServiceMock from '../http-mocks/idam'

const cookieName: string = config.get<string>('session.cookieName')

describe('Login oauth', async () => {

  describe('on GET', async () => {
    describe('for authorized user', async () => {

      it('should save JWT token in cookie when auth token is retrieved from idam', async () => {
        const token = 'I am dummy access token'
        idamServiceMock.resolveRetrieveAuthTokenFor(token)

        await request(app)
          .get(`${AppPaths.oauth.uri}?code=ABC`)
          .expect(res => expect(res).to.have.cookie(cookieName, token))
      })
    })
  })
})
