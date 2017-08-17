import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'

import { attachDefaultHooks } from '../../../routes/hooks'
import '../../../routes/expectations'
import { checkAuthorizationGuards } from './checks/authorization-check'

import { Paths as ClaimPaths } from 'claim/paths'

import { app } from '../../../../main/app'

import * as idamServiceMock from '../../../http-mocks/idam'
import * as draftStoreServiceMock from '../../../http-mocks/draft-store'
import * as claimStoreServiceMock from '../../../http-mocks/claim-store'

const cookieName: string = config.get<string>('session.cookieName')

describe('Claim issue: dashboard page', () => {
  attachDefaultHooks()

  describe('on GET', () => {
    checkAuthorizationGuards(app, 'get', ClaimPaths.dashboardPage.uri)

    context('when user authorised', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor(1, 'cmc-private-beta', 'claimant')
      })

      it('should return 500 and render error page when cannot retrieve claims', async () => {
        draftStoreServiceMock.resolveRetrieve('claim')
        claimStoreServiceMock.rejectRetrieveByClaimantId('HTTP error')

        await request(app)
          .get(ClaimPaths.dashboardPage.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.serverError.withText('Error'))
      })

      context('when no claims issued', () => {
        beforeEach(() => {
          claimStoreServiceMock.resolveRetrieveByClaimantIdToEmptyList()
        })

        it('should redirect to task list when draft saved and everything is fine', async () => {
          draftStoreServiceMock.resolveRetrieve('claim', { lastUpdateTimestamp: 1 })

          await request(app)
            .get(ClaimPaths.dashboardPage.uri)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.redirect.toLocation(ClaimPaths.taskListPage.uri))
        })

        it('should redirect to start page when draft not saved and everything is fine', async () => {
          draftStoreServiceMock.resolveRetrieve('claim', { lastUpdateTimestamp: undefined })

          await request(app)
            .get(ClaimPaths.dashboardPage.uri)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.redirect.toLocation(ClaimPaths.startPage.uri))
        })
      })

      context('when at least one claim issued', () => {
        beforeEach(() => {
          claimStoreServiceMock.resolveRetrieveByClaimantId()
        })

        it('should render page with continue claim button when everything is fine', async () => {
          draftStoreServiceMock.resolveRetrieve('claim', { lastUpdateTimestamp: 1 })

          await request(app)
            .get(ClaimPaths.dashboardPage.uri)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.successful.withText('Your dashboard', 'Continue claim'))
        })

        it('should render page with start claim button when everything is fine', async () => {
          draftStoreServiceMock.resolveRetrieve('claim', { lastUpdateTimestamp: undefined })

          await request(app)
            .get(ClaimPaths.dashboardPage.uri)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.successful.withText('Your dashboard', 'Start claim'))
        })
      })
    })

  })
})
