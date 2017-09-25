import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'

import { attachDefaultHooks } from '../../../routes/hooks'
import '../../../routes/expectations'
import { checkAuthorizationGuards } from './checks/authorization-check'
import { checkAlreadySubmittedGuard } from './checks/already-submitted-check'

import { Paths as ResponsePaths } from 'response/paths'

import { app } from '../../../../main/app'

import * as idamServiceMock from '../../../http-mocks/idam'
import * as draftStoreServiceMock from '../../../http-mocks/draft-store'
import * as claimStoreServiceMock from '../../../http-mocks/claim-store'

const cookieName: string = config.get<string>('session.cookieName')

describe('Defendant response: task list page', () => {
  attachDefaultHooks()

  describe('on GET', () => {
    checkAuthorizationGuards(app, 'get', ResponsePaths.taskListPage.uri)

    context('when user authorised', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor(1, 'cmc-private-beta', 'defendant')
      })

      checkAlreadySubmittedGuard(app, 'get', ResponsePaths.taskListPage.uri)

      context('when response not submitted', () => {
        beforeEach(() => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId()
        })

        it('should return 500 and render error page when cannot retrieve claim', async () => {
          draftStoreServiceMock.resolveRetrieve('response')
          claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error')

          await request(app)
            .get(ResponsePaths.taskListPage.uri)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.serverError.withText('Error'))
        })

        it('should render page when everything is fine', async () => {
          draftStoreServiceMock.resolveRetrieve('response')
          claimStoreServiceMock.resolveRetrieveClaimByExternalId()

          await request(app)
            .get(ResponsePaths.taskListPage.uri)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.successful.withText('Respond to a money claim'))
        })
      })
    })
  })
})
