import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'
import * as mock from 'nock'

import 'test/routes/expectations'

import { Paths as AppPaths } from 'paths'

import { app } from 'main/app'

import * as idamServiceMock from 'test/http-mocks/idam'
import { attachDefaultHooks } from 'test/routes/hooks'

const cookieName: string = config.get<string>('session.cookieName')

describe('Logout receiver', () => {
  attachDefaultHooks(app)

  beforeEach(() => {
    mock.cleanAll()
    idamServiceMock.resolveRetrieveUserFor('1', 'citizen')

  })

  describe('on GET', () => {
    it('should remove session cookie', async () => {
      idamServiceMock.resolveInvalidateSession('ABC')

      await request(app)
        .get(AppPaths.logoutReceiver.uri)
        .set('Cookie', `${cookieName}=ABC`)
        .expect(res => expect(res).to.have.cookie(cookieName, ''))
    })

    it('should remove session cookie even when session invalidation is failed ', async () => {
      idamServiceMock.rejectInvalidateSession(idamServiceMock.defaultAuthToken, 'bearerToken')

      await request(app)
        .get(AppPaths.logoutReceiver.uri)
        .set('Cookie', `${cookieName}=${idamServiceMock.defaultAuthToken}`)
        .expect(res => expect(res).to.have.cookie(cookieName, ''))
    })

    it('should not remove session cookie or invalidate auth token when session cookie is missing ', async () => {

      await request(app)
        .get(AppPaths.logoutReceiver.uri)
        .set('Cookie', null)
        .expect(res => expect(res).not.to.have.cookie)
    })
  })
})
