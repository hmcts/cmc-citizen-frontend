import { Paths as AppPaths } from 'paths'
import { expect } from 'chai'
import { Paths as ClaimPaths } from 'claim/paths'
import { Paths as EligibilityPaths } from 'eligibility/paths'
import * as config from 'config'
import * as cookieEncrypter from '@hmcts/cookie-encrypter'
import { Paths as DashboardPaths } from 'dashboard/paths'
import { Paths as FirstContactPaths } from 'first-contact/paths'
import { cookieName as eligibilityCookieName } from 'eligibility/store'
import { eligibleCookie } from 'test/data/cookie/eligibility'
import * as request from 'supertest'

import { app } from 'main/app'
import * as draftStoreServiceMock from 'test/http-mocks/draft-store'
import * as claimStoreServiceMock from 'test/http-mocks/claim-store'

import * as idamServiceMock from 'test/http-mocks/idam'
import 'test/routes/expectations'

import { attachDefaultHooks } from 'test/routes/hooks'
import { FeatureToggles } from 'utils/featureToggles'
import { LaunchDarklyClient } from 'shared/clients/launchDarklyClient'
import * as toBoolean from 'to-boolean'

const cookieName: string = config.get<string>('session.cookieName')

describe('Login receiver', async () => {
  attachDefaultHooks(app)

  describe('on GET', async () => {

    describe('for authorized user', async () => {

      it('should save bearer token in cookie when auth token is retrieved from idam', async () => {
        idamServiceMock.resolveRetrieveUserFor('1', 'citizen')
        const token = 'I am dummy access token'
        idamServiceMock.resolveExchangeCode(token)

        await request(app)
          .get(`${AppPaths.receiver.uri}?code=ABC&state=123`)
          .set('Cookie', 'state=123')
          .expect(res => expect(res).to.have.cookie(cookieName, token))
      })

      it('should clear state cookie when auth token is retrieved from idam', async () => {
        idamServiceMock.resolveRetrieveUserFor('1', 'citizen')
        const token = 'I am dummy access token'
        idamServiceMock.resolveExchangeCode(token)

        await request(app)
          .get(`${AppPaths.receiver.uri}?code=ABC&state=123`)
          .set('Cookie', 'state=123')
          .expect(res => expect(res).to.have.cookie('state', ''))
      })

      it('should return 500 and render error page when cannot retrieve claim drafts', async () => {
        idamServiceMock.resolveRetrieveUserFor('1', 'citizen')
        claimStoreServiceMock.resolveRetrieveByClaimantIdToEmptyList()
        draftStoreServiceMock.resolveFindNoDraftFound()
        draftStoreServiceMock.rejectFind('HTTP error')

        await request(app)
          .get(AppPaths.receiver.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.serverError.withText('Error'))
      })

      it('should return 500 and render error page when cannot retrieve response drafts with LD ON', async () => {
        if (FeatureToggles.isAnyEnabled('dashboard_pagination_enabled')) {
          idamServiceMock.resolveRetrieveUserFor('1', 'citizen')
          draftStoreServiceMock.resolveFindNoDraftFound()
          draftStoreServiceMock.rejectFind('HTTP error')
          claimStoreServiceMock.resolveRetrieveByClaimantIdToEmptyList()
        }
        await request(app)
          .get(AppPaths.receiver.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.serverError.withText('Error'))
      })

      context('when valid eligibility cookie exists (user with intention to create a claim)', async () => {
        it('should redirect to task list', async () => {
          idamServiceMock.resolveRetrieveUserFor('1', 'citizen')
          const encryptedEligibilityCookie = cookieEncrypter.encryptCookie('j:' + JSON.stringify(eligibleCookie), { key: config.get('secrets.cmc.encryptionKey') })

          await request(app)
            .get(AppPaths.receiver.uri)
            .set('Cookie', `${cookieName}=ABC;${eligibilityCookieName}=e:${encryptedEligibilityCookie}`)
            .expect(res => expect(res).to.be.redirect.toLocation(ClaimPaths.taskListPage.uri))
        })
      })

      context('when no claim issued or received and no drafts (new claimant) with LD ON', async () => {
        it('should redirect to eligibility start page', async () => {
          if (FeatureToggles.isAnyEnabled('dashboard_pagination_enabled')) {
            idamServiceMock.resolveRetrieveUserFor('1', 'citizen')
            claimStoreServiceMock.resolveRetrieveByClaimantIdToEmptyList()
            draftStoreServiceMock.resolveFindNoDraftFound()
            draftStoreServiceMock.resolveFindNoDraftFound()
          }

          await request(app)
            .get(AppPaths.receiver.uri)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.redirect.toLocation(EligibilityPaths.startPage.uri))
        })
      })

      context('when only draft claim exists (claimant making first claim)', async () => {
        it('should redirect to dashboard', async () => {
          idamServiceMock.resolveRetrieveUserFor('1', 'citizen', 'letter-1')

          await request(app)
            .get(AppPaths.receiver.uri)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.redirect.toLocation(DashboardPaths.dashboardPage.uri))
        })
      })

      context('when only claim issued (claimant made first claim) with LD ON', async () => {
        it('should redirect to dashboard', async () => {
          if (FeatureToggles.isAnyEnabled('dashboard_pagination_enabled')) {
            idamServiceMock.resolveRetrieveUserFor('1', 'citizen')
            claimStoreServiceMock.resolveRetrieveByClaimantId()
            draftStoreServiceMock.resolveFindNoDraftFound()
            draftStoreServiceMock.resolveFindNoDraftFound()
          }
          await request(app)
            .get(AppPaths.receiver.uri)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.redirect.toLocation(DashboardPaths.dashboardPage.uri))
        })
      })

      context('when claim issued and draft claim exists (claimant making another claim)', async () => {
        it('should redirect to dashboard', async () => {
          if (FeatureToggles.isAnyEnabled('dashboard_pagination_enabled')) {
            idamServiceMock.resolveRetrieveUserFor('1', 'citizen')
            claimStoreServiceMock.resolveRetrieveByClaimantId()
            draftStoreServiceMock.resolveFind('claim')
            draftStoreServiceMock.resolveFindNoDraftFound()
          }
          await request(app)
            .get(AppPaths.receiver.uri)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.redirect.toLocation(DashboardPaths.dashboardPage.uri))
        })

        it('should redirect to dashboard', async () => {
          if (FeatureToggles.isAnyEnabled('dashboard_pagination_enabled')) {
            idamServiceMock.resolveRetrieveUserFor('1', 'citizen')
            claimStoreServiceMock.resolveRetrieveByClaimantId()
            draftStoreServiceMock.resolveFind('claim')
            draftStoreServiceMock.resolveFindNoDraftFound()
          } else if (!FeatureToggles.isAnyEnabled('dashboard_pagination_enabled')) {
            idamServiceMock.resolveRetrieveUserFor('1', 'citizen')
            claimStoreServiceMock.resolveRetrieveByClaimantId()
            draftStoreServiceMock.resolveFind('claim')
            draftStoreServiceMock.resolveFindNoDraftFound()
            claimStoreServiceMock.resolveRetrieveByDefendantIdToEmptyList()
          }

          await request(app)
            .get(AppPaths.receiver.uri)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.redirect.toLocation(DashboardPaths.dashboardPage.uri))
        })
      })

      context('when only claim received (defendant served with first claim)', async () => {
        it('should redirect to dashboard', async () => {
          idamServiceMock.resolveRetrieveUserFor('1', 'citizen', 'letter-1')

          await request(app)
            .get(AppPaths.receiver.uri)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.redirect.toLocation(DashboardPaths.dashboardPage.uri))
        })
      })

      context('when claim received and draft response exists (defendant responding to claim)', async () => {
        it('should redirect to dashboard', async () => {
          idamServiceMock.resolveRetrieveUserFor('1', 'citizen', 'letter-1')

          await request(app)
            .get(AppPaths.receiver.uri)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.redirect
              .toLocation(DashboardPaths.dashboardPage.uri))
        })
      })

      context('when defendant starts response journey ', async () => {
        it('when claim is valid claim summary page to be displayed', async () => {
          idamServiceMock.resolveRetrieveUserFor('1', 'citizen', 'letter-1')

          await request(app)
            .get(AppPaths.receiver.uri + '?state=000MC027')
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.redirect
              .toLocation(FirstContactPaths.claimSummaryPage.uri))
        })

        it('when defendant tries to link and authentication is required', async () => {
          await request(app)
            .get(AppPaths.receiver.uri + '?state=123')
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.serverError)
        })

        it('when letter holder cookie present then by linking redirect to dashboard', async () => {
          idamServiceMock.resolveRetrieveUserFor('1', 'citizen', 'letter-1')
          claimStoreServiceMock.resolveLinkDefendant()

          await request(app)
            .get(AppPaths.receiver.uri + '?state=123')
            .set('Cookie', [`${cookieName}=ABC`, 'lid=lasjlfkkjlef'])
            .expect(res => expect(res).to.be.redirect.toLocation(DashboardPaths.dashboardPage.uri))
        })
      })

      context('when claim received and draft claim exists (defendant making first claim)', async () => {
        it('should redirect to dashboard', async () => {
          idamServiceMock.resolveRetrieveUserFor('1', 'citizen', 'letter-1')

          await request(app)
            .get(AppPaths.receiver.uri)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.redirect.toLocation(DashboardPaths.dashboardPage.uri))
        })
      })

      context('when claim received and another claim issued (defendant made first claim)', async () => {
        it('should redirect to dashboard', async () => {
          idamServiceMock.resolveRetrieveUserFor('1', 'citizen', 'letter-1')

          await request(app)
            .get(AppPaths.receiver.uri)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.redirect.toLocation(DashboardPaths.dashboardPage.uri))
        })

        it('should redirect to login when there is an exception', async () => {
          const token = 'I am dummy access token'
          idamServiceMock.rejectRetrieveServiceToken(token)

          await request(app)
            .get(AppPaths.receiver.uri)
            .set('Cookie', `${cookieName}=1`)
            .expect(res => expect(res).to.be.serverError)
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

      it('should return error otherwise', async () => {
        await request(app)
          .get(`${AppPaths.receiver.uri}?code=ABC&state=123`)
          .set('Cookie', 'state=123')
          .expect(res => expect(res).to.be.serverError)
      })
    })
  })
})

describe('isPaginationForDashboardEnabled', () => {
  it('should return toggle if pagination toggle exists', async () => {
    const mockLaunchDarklyClient: LaunchDarklyClient = new LaunchDarklyClient()
    const featureToggles = new FeatureToggles(mockLaunchDarklyClient)
    let actual = toBoolean(config.get<boolean>(`featureToggles.dashboard_pagination_enabled`))
    let result = await featureToggles.isDashboardPaginationEnabled()
    expect(result).to.equal(actual)
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

    describe('for unauthorized user', () => {
      it('should redirect to link defendant when there is an exception', async () => {
        const token = 'I am dummy access token'
        idamServiceMock.rejectRetrieveServiceToken(token)

        await request(app)
          .get(`${pagePath}?code=123`)
          .expect(res => expect(res).to.be.serverError)
      })

      it('should redirect to link defendant when there is no auth token', async () => {
        const token = ''
        idamServiceMock.resolveExchangeCode(token)

        await request(app)
          .get(`${pagePath}?code=123`)
          .expect(res => expect(res).to.be.redirect.toLocation(/.*\/login.*/))
      })
    })
  })
})
