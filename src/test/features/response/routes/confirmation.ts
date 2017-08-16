import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'

import { attachDefaultHooks } from '../../../routes/hooks'
import { checkAuthorizationGuards } from './checks/authorization-check'

import { Paths as ResponsePaths } from 'response/paths'

import { app } from '../../../../main/app'

import * as idamServiceMock from '../../../http-mocks/idam'
import * as claimStoreServiceMock from '../../../http-mocks/claim-store'

const cookieName: string = config.get<string>('session.cookieName')

describe('Defendant response: confirmation page', () => {
  attachDefaultHooks()

  describe('on GET', () => {
    checkAuthorizationGuards(app, 'get', ResponsePaths.confirmationPage.uri)

    describe('for authorized user', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor(1, 'cmc-private-beta', 'defendant')
      })

      it('should render page when everything is fine', async () => {
        claimStoreServiceMock.resolveRetrieveByDefendantId('CLAIM-REF', 1)
        claimStoreServiceMock.resolveRetrieveResponsesByDefendantId()

        await request(app)
          .get(ResponsePaths.confirmationPage.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.successful.withText('Defence submitted'))
      })

      it('should return 500 and render error page when cannot retrieve claim by defendant id', async () => {
        claimStoreServiceMock.rejectRetrieveByDefendantId('internal service error when retrieving claim')

        await request(app)
          .get(ResponsePaths.confirmationPage.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.serverError.withText('Error'))
      })

      it('should return 500 and render error page when cannot retrieve response by defendant id', async () => {
        claimStoreServiceMock.resolveRetrieveByDefendantId('CLAIM-REF', 1)
        claimStoreServiceMock.rejectRetrieveResponseByDefendantId('internal service error when retrieving response')

        await request(app)
          .get(ResponsePaths.confirmationPage.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.serverError.withText('Error'))
      })
    })
  })
})
