import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'

import { attachDefaultHooks } from '../../../routes/hooks'
import '../../../routes/expectations'
import { checkAuthorizationGuards } from './checks/authorization-check'

import { Paths as ResponsePaths } from 'response/paths'

import { app } from '../../../../main/app'

import * as idamServiceMock from '../../../http-mocks/idam'

const cookieName: string = config.get<string>('session.cookieName')

describe('Defendant response: post login receiver', () => {
  attachDefaultHooks()

  describe('on GET', () => {
    checkAuthorizationGuards(app, 'get', ResponsePaths.defendantLoginReceiver.uri)

    describe('for authorized user', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor(1, 'cmc-private-beta', 'defendant')
      })

      it('should redirect to task list page when everything is fine', async () => {
        await request(app)
          .get(`${ResponsePaths.defendantLoginReceiver.uri}?jwt=ABC`)
          .expect(res => expect(res).to.be.redirect.toLocation(ResponsePaths.taskListPage.uri))
      })

      it('should save JWT token in cookie when JWT token exists in query string', async () => {
        await request(app)
          .get(`${ResponsePaths.defendantLoginReceiver.uri}?jwt=ABC`)
          .expect(res => expect(res).to.have.cookie(cookieName, 'ABC'))
      })

      it('should not remove JWT token saved in cookie when JWT token does not exist in query string', async () => {
        await request(app)
          .get(ResponsePaths.defendantLoginReceiver.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.not.have.cookie(cookieName, ''))
      })
    })
  })
})
