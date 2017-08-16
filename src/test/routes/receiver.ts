import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'

import { attachDefaultHooks } from './hooks'
import './expectations'

import { Paths as AppPaths } from 'app/paths'
import { Paths as ClaimPaths } from 'claim/paths'
import { Paths as ResponsePaths } from 'response/paths'
import { Paths as DashboardPaths } from 'dashboard/paths'

import { app } from '../../main/app'

import * as idamServiceMock from '../http-mocks/idam'
import * as claimStoreServiceMock from '../http-mocks/claim-store'
import * as draftStoreServiceMock from '../http-mocks/draft-store'

const cookieName: string = config.get<string>('session.cookieName')

describe('Login receiver', async () => {
  attachDefaultHooks()

  describe('on GET', async () => {
    describe('for authorized user', async () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor(1, 'cmc-private-beta')
      })

      it('should save JWT token in cookie when JWT token exists in query string', async () => {
        draftStoreServiceMock.resolveRetrieve('claim')
        draftStoreServiceMock.resolveRetrieve('response')
        claimStoreServiceMock.resolveRetrieveByClaimantId()
        claimStoreServiceMock.resolveRetrieveResponsesByDefendantId()

        await request(app)
          .get(`${AppPaths.receiver.uri}?jwt=ABC`)
          .expect(res => expect(res).to.have.cookie(cookieName, 'ABC'))
      })

      it('should not remove JWT token saved in cookie when JWT token does not exist in query string', async () => {
        draftStoreServiceMock.resolveRetrieve('claim')
        draftStoreServiceMock.resolveRetrieve('response')
        claimStoreServiceMock.resolveRetrieveByClaimantId()
        claimStoreServiceMock.resolveRetrieveResponsesByDefendantId()

        await request(app)
          .get(AppPaths.receiver.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.not.have.cookie(cookieName, ''))
      })

      it('should return 500 and render error page when cannot retrieve draft', async () => {
        draftStoreServiceMock.rejectRetrieve('claim', 'Cos')

        await request(app)
          .get(AppPaths.receiver.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.serverError.withText('Error'))
      })

      context('when no claim or response', async () => {
        it('should redirect to claim start', async () => {
          draftStoreServiceMock.resolveRetrieveNoDraftFound('claim')
          draftStoreServiceMock.resolveRetrieveNoDraftFound('response')
          claimStoreServiceMock.resolveRetrieveByClaimantIdToEmptyList()
          claimStoreServiceMock.resolveRetrieveResponsesByDefendantIdToEmptyList()

          await request(app)
            .get(AppPaths.receiver.uri)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.redirect.toLocation(ClaimPaths.startPage.uri))
        })
      })

      context('when draft claim exists', async () => {
        it('should redirect to claim task-list', async () => {
          draftStoreServiceMock.resolveRetrieve('claim')
          draftStoreServiceMock.resolveRetrieveNoDraftFound('response')
          claimStoreServiceMock.resolveRetrieveByClaimantIdToEmptyList()
          claimStoreServiceMock.resolveRetrieveResponsesByDefendantIdToEmptyList()

          await request(app)
            .get(AppPaths.receiver.uri)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.redirect.toLocation(ClaimPaths.taskListPage.uri))
        })
      })

      context('when draft response exists', async () => {
        it('should redirect to response task-list', async () => {
          draftStoreServiceMock.resolveRetrieveNoDraftFound('claim')
          draftStoreServiceMock.resolveRetrieve('response')
          claimStoreServiceMock.resolveRetrieveByClaimantIdToEmptyList()
          claimStoreServiceMock.resolveRetrieveResponsesByDefendantIdToEmptyList()

          await request(app)
            .get(AppPaths.receiver.uri)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.redirect.toLocation(ResponsePaths.taskListPage.uri))
        })
      })

      context('when draft claim and draft response exists', async () => {
        it('should redirect to dashboard', async () => {
          draftStoreServiceMock.resolveRetrieve('claim')
          draftStoreServiceMock.resolveRetrieve('response')
          claimStoreServiceMock.resolveRetrieveByClaimantIdToEmptyList()
          claimStoreServiceMock.resolveRetrieveResponsesByDefendantIdToEmptyList()

          await request(app)
            .get(AppPaths.receiver.uri)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.redirect.toLocation(DashboardPaths.dashboardPage.uri))
        })
      })

      context('when claim exists', async () => {
        it('should redirect to dashboard', async () => {
          draftStoreServiceMock.resolveRetrieveNoDraftFound('claim')
          draftStoreServiceMock.resolveRetrieveNoDraftFound('response')
          claimStoreServiceMock.resolveRetrieveByClaimantId()
          claimStoreServiceMock.resolveRetrieveResponsesByDefendantIdToEmptyList()

          await request(app)
            .get(AppPaths.receiver.uri)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.redirect.toLocation(DashboardPaths.dashboardPage.uri))
        })
      })
      context('when response exists', async () => {
        it('should redirect to dashboard', async () => {
          draftStoreServiceMock.resolveRetrieveNoDraftFound('claim')
          draftStoreServiceMock.resolveRetrieveNoDraftFound('response')
          claimStoreServiceMock.resolveRetrieveByClaimantIdToEmptyList()
          claimStoreServiceMock.resolveRetrieveResponsesByDefendantId()

          await request(app)
            .get(AppPaths.receiver.uri)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.redirect.toLocation(DashboardPaths.dashboardPage.uri))
        })
      })
      context('when claim and response exists', async () => {
        it('should redirect to dashboard', async () => {
          draftStoreServiceMock.resolveRetrieveNoDraftFound('claim')
          draftStoreServiceMock.resolveRetrieveNoDraftFound('response')
          claimStoreServiceMock.resolveRetrieveByClaimantId()
          claimStoreServiceMock.resolveRetrieveResponsesByDefendantId()

          await request(app)
            .get(AppPaths.receiver.uri)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.redirect.toLocation(DashboardPaths.dashboardPage.uri))
        })
      })

    })
  })
})
