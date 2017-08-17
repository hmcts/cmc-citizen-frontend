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

describe('Defendant response: dashboard', () => {
  attachDefaultHooks()

  describe('on GET', () => {
    checkAuthorizationGuards(app, 'get', ResponsePaths.dashboardPage.uri)

    context('when user authorised', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor(1, 'cmc-private-beta', 'defendant')
      })

      it('should return 500 and render error page when cannot retrieve claim in guard', async () => {
        claimStoreServiceMock.rejectRetrieveByDefendantId('HTTP error')

        await request(app)
          .get(ResponsePaths.dashboardPage.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.serverError.withText('Error'))
      })

      it('should return 500 and render error page when cannot retrieve response in guard', async () => {
        claimStoreServiceMock.resolveRetrieveByDefendantId('000MC001')
        claimStoreServiceMock.rejectRetrieveResponseByDefendantId('HTTP error')

        await request(app)
          .get(ResponsePaths.dashboardPage.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.serverError.withText('Error'))
      })

      it('should redirect to task list when response has not been submitted yet', async () => {
        claimStoreServiceMock.resolveRetrieveByDefendantId('000MC001')
        claimStoreServiceMock.resolveRetrieveResponsesByDefendantIdToEmptyList()

        await request(app)
          .get(ResponsePaths.dashboardPage.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.redirect.toLocation(ResponsePaths.taskListPage.uri))
      })

      it('should render page when response has been already made', async () => {
        claimStoreServiceMock.resolveRetrieveByDefendantId('000MC001')
        claimStoreServiceMock.resolveRetrieveResponsesByDefendantId()

        await request(app)
          .get(ResponsePaths.dashboardPage.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.successful.withText('Your dashboard'))
      })
    })
  })
})
