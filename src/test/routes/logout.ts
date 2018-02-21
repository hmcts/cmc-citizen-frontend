import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'
import * as mock from 'nock'

import './expectations'

import { Paths as AppPaths } from 'app/paths'

import { app } from '../../main/app'

import * as idamServiceMock from '../http-mocks/idam'

const cookieName: string = config.get<string>('session.cookieName')

describe('Logout receiver', () => {
  beforeEach(() => {
    mock.cleanAll()
  })

  describe('on GET', () => {
    it('should remove session cookie', async () => {
      idamServiceMock.resolveRetrieveUserFor('1', 'citizen')
      idamServiceMock.resolveInvalidateSession('ABC')

      await request(app)
        .get(AppPaths.logoutReceiver.uri)
        .set('Cookie', `${cookieName}=ABC`)
        .expect(res => expect(res).to.have.cookie(cookieName, ''))
    })

    it('should remove session cookie even when session invalidation is failed ', async () => {
      idamServiceMock.resolveRetrieveUserFor('1', 'citizen')
      idamServiceMock.rejectInvalidateSession(idamServiceMock.defaultServiceAuthToken)

      await request(app)
        .get(AppPaths.logoutReceiver.uri)
        .set('Cookie', `${cookieName}=${idamServiceMock.defaultServiceAuthToken}`)
        .expect(res => expect(res).to.have.cookie(cookieName, ''))
    })

    it('should not remove session cookie or invalidate auth token when session cookie is missing ', async () => {
      idamServiceMock.resolveRetrieveUserFor('1', 'citizen')

      await request(app)
        .get(AppPaths.logoutReceiver.uri)
        .set('Cookie', null)
        .expect(res => expect(res).not.to.have.cookie)
    })
  })
})
