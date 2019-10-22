import { Paths as AppPaths } from 'paths'
import { expect } from 'chai'
import { Paths as ClaimPaths } from 'claim/paths'
import { Paths as EligibilityPaths } from 'eligibility/paths'
import * as config from 'config'
import * as cookieEncrypter from 'cookie-encrypter'
import { Paths as DashboardPaths } from 'dashboard/paths'

import { cookieName as eligibilityCookieName } from 'eligibility/store'
import { eligibleCookie } from 'test/data/cookie/eligibility'
import * as request from 'supertest'

import { app } from 'main/app'
import * as claimStoreServiceMock from 'test/http-mocks/claim-store'
import * as draftStoreServiceMock from 'test/http-mocks/draft-store'

import * as idamServiceMock from 'test/http-mocks/idam'
import 'test/routes/expectations'

import { attachDefaultHooks } from 'test/routes/hooks'

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

        await request(app)
          .get(`${AppPaths.receiver.uri}?code=ABC&state=123`)
          .set('Cookie', 'state=123')
          .expect(res => expect(res).to.have.cookie(cookieName, token))
      })

      it('should clear state cookie when auth token is retrieved from idam', async () => {
        const token = 'I am dummy access token'
        idamServiceMock.resolveExchangeCode(token)

        await request(app)
          .get(`${AppPaths.receiver.uri}?code=ABC&state=123`)
          .set('Cookie', 'state=123')
          .expect(res => expect(res).to.have.cookie('state', ''))
      })

      it('should return 500 and render error page when cannot retrieve claimant claims', async () => {
        const token = 'I am dummy access token'
        idamServiceMock.resolveExchangeCode(token)
        claimStoreServiceMock.resolveLinkDefendant()
        claimStoreServiceMock.rejectRetrieveByClaimantId('HTTP error')

        await request(app)
          .get(`${AppPaths.receiver.uri}?code=ABC&state=123`)
          .set('Cookie', 'state=123')
          .expect(res => expect(res).to.be.serverError.withText('Error'))
      })

      it('should return 500 and render error page when cannot retrieve defendant claims', async () => {
        claimStoreServiceMock.resolveLinkDefendant()
        claimStoreServiceMock.resolveRetrieveByClaimantIdToEmptyList()
        claimStoreServiceMock.rejectRetrieveByDefendantId('HTTP error')

        await request(app)
          .get(AppPaths.receiver.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.serverError.withText('Error'))
      })

      it('should return 500 and render error page when cannot retrieve claim drafts', async () => {
        claimStoreServiceMock.resolveLinkDefendant()
        claimStoreServiceMock.resolveRetrieveByClaimantIdToEmptyList()
        claimStoreServiceMock.resolveRetrieveByDefendantIdToEmptyList()
        draftStoreServiceMock.rejectFind('HTTP error')

        await request(app)
          .get(AppPaths.receiver.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.serverError.withText('Error'))
      })

      it('should return 500 and render error page when cannot retrieve response drafts', async () => {
        claimStoreServiceMock.resolveLinkDefendant()
        claimStoreServiceMock.resolveRetrieveByClaimantIdToEmptyList()
        claimStoreServiceMock.resolveRetrieveByDefendantIdToEmptyList()
        draftStoreServiceMock.resolveFindNoDraftFound()
        draftStoreServiceMock.rejectFind('HTTP error')

        await request(app)
          .get(AppPaths.receiver.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.serverError.withText('Error'))
      })

      context('when valid eligibility cookie exists (user with intention to create a claim)', async () => {
        it('should redirect to task list', async () => {
          claimStoreServiceMock.resolveLinkDefendant()

          const encryptedEligibilityCookie = cookieEncrypter.encryptCookie('j:' + JSON.stringify(eligibleCookie), { key: config.get('secrets.cmc.encryptionKey') })

          await request(app)
            .get(AppPaths.receiver.uri)
            .set('Cookie', `${cookieName}=ABC;${eligibilityCookieName}=e:${encryptedEligibilityCookie}`)
            .expect(res => expect(res).to.be.redirect.toLocation(ClaimPaths.taskListPage.uri))
        })
      })

      context('when no claim issued or received and no drafts (new claimant)', async () => {
        it('should redirect to eligibility start page', async () => {
          claimStoreServiceMock.resolveLinkDefendant()
          claimStoreServiceMock.resolveRetrieveByClaimantIdToEmptyList()
          claimStoreServiceMock.resolveRetrieveByDefendantIdToEmptyList()
          draftStoreServiceMock.resolveFindNoDraftFound()
          draftStoreServiceMock.resolveFindNoDraftFound()

          await request(app)
            .get(AppPaths.receiver.uri)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.redirect.toLocation(EligibilityPaths.startPage.uri))
        })
      })

      context('when only draft claim exists (claimant making first claim)', async () => {
        it('should redirect to dashboard', async () => {
          claimStoreServiceMock.resolveLinkDefendant()
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
          claimStoreServiceMock.resolveLinkDefendant()
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
          claimStoreServiceMock.resolveLinkDefendant()
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
          claimStoreServiceMock.resolveLinkDefendant()
          claimStoreServiceMock.resolveRetrieveByClaimantIdToEmptyList()
          claimStoreServiceMock.resolveRetrieveByDefendantId('100MC001')
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
          claimStoreServiceMock.resolveLinkDefendant()
          claimStoreServiceMock.resolveRetrieveByClaimantIdToEmptyList()
          claimStoreServiceMock.resolveRetrieveByDefendantId('100MC001')
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
          claimStoreServiceMock.resolveLinkDefendant()
          claimStoreServiceMock.resolveRetrieveByClaimantIdToEmptyList()
          claimStoreServiceMock.resolveRetrieveByDefendantId('100MC001')
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
          claimStoreServiceMock.resolveLinkDefendant()
          claimStoreServiceMock.resolveRetrieveByClaimantId()
          claimStoreServiceMock.resolveRetrieveByDefendantId('100MC001')
          draftStoreServiceMock.resolveFindNoDraftFound()
          draftStoreServiceMock.resolveFindNoDraftFound()

          await request(app)
            .get(AppPaths.receiver.uri)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.redirect.toLocation(DashboardPaths.dashboardPage.uri))
        })
      })
    })

    describe('for expired user credentials', () => {
      it('should redirect to login', async () => {
        const token = 'I am dummy access token'
        idamServiceMock.rejectExchangeCode(token)

        await request(app)
          .get(`${AppPaths.receiver.uri}?code=ABC&state=123`)
          .set('Cookie', 'state=123')
          .expect(res => expect(res).to.be.redirect.toLocation(/.*\/login.*/))
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
