import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'
import * as mock from 'nock'

import './expectations'

import { Paths as AppPaths } from 'app/paths'
import { Paths as ResponsePaths } from 'response/paths'

import { app } from '../../main/app'

import * as idamServiceMock from '../http-mocks/idam'

const cookieName: string = config.get<string>('session.cookieName')

describe('Logout receiver', () => {
  beforeEach(() => {
    mock.cleanAll()
  })

  describe('on GET', () => {
    it('should redirect to claimant home page', async () => {
      idamServiceMock.resolveRetrieveUserFor(1, 'cmc-private-beta', 'claimant')

      await request(app)
        .get(AppPaths.logoutReceiver.uri + '?from=claim')
        .set('Cookie', `${cookieName}=ABC`)
        .expect(res => expect(res).to.be.redirect.toLocation(AppPaths.homePage.uri))
    })

    it('should redirect to defendant home page', async () => {
      idamServiceMock.resolveRetrieveUserFor(1, 'cmc-private-beta', 'claimant')

      await request(app)
        .get(AppPaths.logoutReceiver.uri + '?from=response')
        .set('Cookie', `${cookieName}=ABC`)
        .expect(res => expect(res).to.be.redirect.toLocation(ResponsePaths.defendantLoginReceiver.uri))
    })

    it('should remove session cookie', async () => {
      idamServiceMock.resolveRetrieveUserFor(1, 'cmc-private-beta', 'claimant')

      await request(app)
        .get(AppPaths.logoutReceiver.uri + '?from=claim')
        .set('Cookie', `${cookieName}=ABC`)
        .expect(res => expect(res).to.not.have.cookie(cookieName, 'ABC'))
    })
  })
})
