import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'

import { attachDefaultHooks } from '../../../routes/hooks'
import '../../../routes/expectations'

import { Paths } from 'dashboard/paths'

import { app } from '../../../../main/app'

import * as idamServiceMock from '../../../http-mocks/idam'
import * as draftStoreServiceMock from '../../../http-mocks/draft-store'
import * as claimStoreServiceMock from '../../../http-mocks/claim-store'
import { checkAuthorizationGuards } from './checks/authorization-check'

const cookieName: string = config.get<string>('session.cookieName')

describe('Dashboard page', () => {
  attachDefaultHooks(app)

  describe('on GET', () => {
    checkAuthorizationGuards(app, 'get', Paths.dashboardPage.uri)

    context('when user authorised', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor('1', 'cmc-private-beta')
      })

      it('should return 500 and render error page when cannot retrieve claims', async () => {
        draftStoreServiceMock.resolveFind('claim')
        claimStoreServiceMock.rejectRetrieveByClaimantId('HTTP error')

        await request(app)
          .get(Paths.dashboardPage.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.serverError.withText('Error'))
      })

      context('when no claims issued', () => {
        beforeEach(() => {
          claimStoreServiceMock.resolveRetrieveByClaimantIdToEmptyList()
          claimStoreServiceMock.resolveRetrieveByDefendantIdToEmptyList()
        })

        it('should render page with start claim button when everything is fine', async () => {
          draftStoreServiceMock.resolveFindNoDraftFound()

          await request(app)
            .get(Paths.dashboardPage.uri)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.successful.withText('Your money claims account', 'Make a new money claim'))
        })
      })

      context('when at least one claim issued', () => {
        beforeEach(() => {
          claimStoreServiceMock.resolveRetrieveByClaimantId()
          claimStoreServiceMock.resolveRetrieveByDefendantId('000MC001', '1')
        })

        it('should render page with continue claim button when everything is fine', async () => {
          draftStoreServiceMock.resolveFind('claim')

          await request(app)
            .get(Paths.dashboardPage.uri)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.successful.withText('Your money claims account', 'Continue with claim'))
        })

        it('should render page with start claim button when everything is fine', async () => {
          draftStoreServiceMock.resolveFindNoDraftFound()

          await request(app)
            .get(Paths.dashboardPage.uri)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.successful.withText('Your money claims account', 'Make a new money claim'))
        })
      })
    })

  })
})
