import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'

import { attachDefaultHooks } from './hooks'
import './expectations'

import { Paths as AppPaths } from 'app/paths'
import { Paths as ClaimPaths } from 'claim/paths'
import { Paths as DashboardPaths } from 'dashboard/paths'

import { app } from '../../main/app'

import * as idamServiceMock from '../http-mocks/idam'
import * as claimStoreServiceMock from '../http-mocks/claim-store'
import * as draftStoreServiceMock from '../http-mocks/draft-store'

const cookieName: string = config.get<string>('session.cookieName')

describe('Login receiver', async () => {
  attachDefaultHooks(app)

  describe('on GET', async () => {

    describe('for authorized user', async () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor('1', 'citizen')
      })

      it('should save bearer token in cookie when auth token is retrieved from idam', async () => {
        const token = 'I am dummy access token'
        idamServiceMock.resolveExchangeCode(token)
        claimStoreServiceMock.resolveRetrieveByClaimantIdToEmptyList()
        claimStoreServiceMock.resolveRetrieveByDefendantIdToEmptyList()
        draftStoreServiceMock.resolveFindNoDraftFound()
        draftStoreServiceMock.resolveFindNoDraftFound()

        await request(app)
          .get(`${AppPaths.receiver.uri}?code=ABC&state=123`)
          .set('Cookie', 'state=123')
          .expect(res => expect(res).to.have.cookie(cookieName, token))
      })

      it('should clear state cookie when auth token is retrieved from idam', async () => {
        const token = 'I am dummy access token'
        idamServiceMock.resolveExchangeCode(token)
        claimStoreServiceMock.resolveRetrieveByClaimantIdToEmptyList()
        claimStoreServiceMock.resolveRetrieveByDefendantIdToEmptyList()
        draftStoreServiceMock.resolveFindNoDraftFound()
        draftStoreServiceMock.resolveFindNoDraftFound()

        await request(app)
          .get(`${AppPaths.receiver.uri}?code=ABC&state=123`)
          .set('Cookie', 'state=123')
          .expect(res => expect(res).to.have.cookie('state', ''))
      })

      it('should return 500 and render error page when cannot retrieve claimant claims', async () => {
        claimStoreServiceMock.rejectRetrieveByClaimantId('HTTP error')

        await request(app)
          .get(AppPaths.receiver.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.serverError.withText('Error'))
      })

      it('should return 500 and render error page when cannot retrieve defendant claims', async () => {
        claimStoreServiceMock.resolveRetrieveByClaimantIdToEmptyList()
        claimStoreServiceMock.rejectRetrieveByDefendantId('HTTP error')

        await request(app)
          .get(AppPaths.receiver.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.serverError.withText('Error'))
      })

      it('should return 500 and render error page when cannot retrieve claim drafts', async () => {
        claimStoreServiceMock.resolveRetrieveByClaimantIdToEmptyList()
        claimStoreServiceMock.resolveRetrieveByDefendantIdToEmptyList()
        draftStoreServiceMock.rejectFind('HTTP error')

        await request(app)
          .get(AppPaths.receiver.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.serverError.withText('Error'))
      })

      it('should return 500 and render error page when cannot retrieve response drafts', async () => {
        claimStoreServiceMock.resolveRetrieveByClaimantIdToEmptyList()
        claimStoreServiceMock.resolveRetrieveByDefendantIdToEmptyList()
        draftStoreServiceMock.resolveFindNoDraftFound()
        draftStoreServiceMock.rejectFind('HTTP error')

        await request(app)
          .get(AppPaths.receiver.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.serverError.withText('Error'))
      })

      context('when no claim issued or received and no drafts (new claimant)', async () => {
        it('should redirect to claim start', async () => {
          claimStoreServiceMock.resolveRetrieveByClaimantIdToEmptyList()
          claimStoreServiceMock.resolveRetrieveByDefendantIdToEmptyList()
          draftStoreServiceMock.resolveFindNoDraftFound()
          draftStoreServiceMock.resolveFindNoDraftFound()

          await request(app)
            .get(AppPaths.receiver.uri)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.redirect.toLocation(ClaimPaths.startPage.uri))
        })
      })

      context('when only draft claim exists (claimant making first claim)', async () => {
        it('should redirect to dashboard', async () => {
          claimStoreServiceMock.resolveRetrieveByClaimantIdToEmptyList()
          claimStoreServiceMock.resolveRetrieveByDefendantIdToEmptyList()
          draftStoreServiceMock.resolveFind('claim')
          draftStoreServiceMock.resolveFindNoDraftFound()

          await request(app)
            .get(AppPaths.receiver.uri)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.redirect.toLocation(DashboardPaths.dashboardPage.uri))
        })
      })

      context('when only claim issued (claimant made first claim)', async () => {
        it('should redirect to dashboard', async () => {
          claimStoreServiceMock.resolveRetrieveByClaimantId()
          claimStoreServiceMock.resolveRetrieveByDefendantIdToEmptyList()
          draftStoreServiceMock.resolveFindNoDraftFound()
          draftStoreServiceMock.resolveFindNoDraftFound()

          await request(app)
            .get(AppPaths.receiver.uri)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.redirect.toLocation(DashboardPaths.dashboardPage.uri))
        })
      })

      context('when claim issued and draft claim exists (claimant making another claim)', async () => {
        it('should redirect to dashboard', async () => {
          claimStoreServiceMock.resolveRetrieveByClaimantId()
          claimStoreServiceMock.resolveRetrieveByDefendantIdToEmptyList()
          draftStoreServiceMock.resolveFind('claim')
          draftStoreServiceMock.resolveFindNoDraftFound()

          await request(app)
            .get(AppPaths.receiver.uri)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.redirect.toLocation(DashboardPaths.dashboardPage.uri))
        })
      })

      context('when only claim received (defendant served with first claim)', async () => {
        it('should redirect to dashboard', async () => {
          claimStoreServiceMock.resolveRetrieveByClaimantIdToEmptyList()
          claimStoreServiceMock.resolveRetrieveByDefendantId('000MC001')
          draftStoreServiceMock.resolveFindNoDraftFound()
          draftStoreServiceMock.resolveFindNoDraftFound()

          await request(app)
            .get(AppPaths.receiver.uri)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.redirect.toLocation(DashboardPaths.dashboardPage.uri))
        })
      })

      context('when claim received and draft response exists (defendant responding to claim)', async () => {
        it('should redirect to dashboard', async () => {
          claimStoreServiceMock.resolveRetrieveByClaimantIdToEmptyList()
          claimStoreServiceMock.resolveRetrieveByDefendantId('000MC001')
          draftStoreServiceMock.resolveFindNoDraftFound()
          draftStoreServiceMock.resolveFind('response')

          await request(app)
            .get(AppPaths.receiver.uri)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.redirect
              .toLocation(DashboardPaths.dashboardPage.uri))
        })
      })

      context('when claim received and draft claim exists (defendant making first claim)', async () => {
        it('should redirect to dashboard', async () => {
          claimStoreServiceMock.resolveRetrieveByClaimantIdToEmptyList()
          claimStoreServiceMock.resolveRetrieveByDefendantId('000MC001')
          draftStoreServiceMock.resolveFind('claim')
          draftStoreServiceMock.resolveFindNoDraftFound()

          await request(app)
            .get(AppPaths.receiver.uri)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.redirect.toLocation(DashboardPaths.dashboardPage.uri))
        })
      })

      context('when claim received and another claim issued (defendant made first claim)', async () => {
        it('should redirect to dashboard', async () => {
          claimStoreServiceMock.resolveRetrieveByClaimantId()
          claimStoreServiceMock.resolveRetrieveByDefendantId('000MC001')
          draftStoreServiceMock.resolveFindNoDraftFound()
          draftStoreServiceMock.resolveFindNoDraftFound()

          await request(app)
            .get(AppPaths.receiver.uri)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.redirect.toLocation(DashboardPaths.dashboardPage.uri))
        })
      })
    })
  })
})

describe('Defendant link receiver', () => {
  const pagePath = AppPaths.linkDefendantReceiver.uri
  attachDefaultHooks(app)

  describe('on GET', () => {

    describe('for authorized user', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor('1', 'citizen', 'letter-1')
      })

      it('should redirect to /receiver', async () => {
        const token = 'token'
        idamServiceMock.resolveExchangeCode(token)

        await request(app)
          .get(`${pagePath}?code=123`)
          .expect(res => expect(res).to.be.redirect.toLocation(AppPaths.receiver.uri))
      })

      it('should set session cookie to token value returned from idam', async () => {
        const token = 'token'
        idamServiceMock.resolveExchangeCode(token)

        await request(app)
          .get(`${pagePath}?code=123`)
          .expect(res => expect(res).to.have.cookie(cookieName, token))
      })
    })
  })
})
