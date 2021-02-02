import { Paths as AppPaths } from 'paths'
import { expect } from 'chai'
import { Paths as EligibilityPaths } from 'eligibility/paths'
import * as config from 'config'
import { Paths as DashboardPaths } from 'dashboard/paths'
import { Paths as FirstContactPaths } from 'first-contact/paths'
import * as request from 'supertest'

import { app } from 'main/app'
import * as draftStoreServiceMock from 'test/http-mocks/draft-store'
import * as claimStoreServiceMock from 'test/http-mocks/claim-store'

import * as idamServiceMock from 'test/http-mocks/idam'
import 'test/routes/expectations'
import * as sinon from 'sinon'
import { attachDefaultHooks } from 'test/routes/hooks'
import { FeatureToggles } from 'utils/featureToggles'
import { LaunchDarklyClient } from 'shared/clients/launchDarklyClient'
import * as toBoolean from 'to-boolean'

let isDashboardPaginationEnabledStub: sinon.SinonStub
const cookieName: string = config.get<string>('session.cookieName')

describe('Login receiver', async () => {
  attachDefaultHooks(app)

  describe('on GET', async () => {

    describe('for authorized users', () => {

      it('should redirect to dashboard when claim exists', async () => {
        idamServiceMock.resolveRetrieveUserFor('1', 'citizen')
        claimStoreServiceMock.resolveRetrieveByClaimantId()
        claimStoreServiceMock.resolveRetrieveByDefendantIdToEmptyList()
        draftStoreServiceMock.resolveFind('claim')
        draftStoreServiceMock.resolveFindNoDraftFound()

        await request(app)
          .get(AppPaths.receiver.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.redirect.toLocation(DashboardPaths.dashboardPage.uri))
      })

      it('should redirect to dashboard when only draft exists', async () => {
        idamServiceMock.resolveRetrieveUserFor('1', 'citizen', 'letter-1')
        claimStoreServiceMock.resolveRetrieveByClaimantIdToEmptyList()
        claimStoreServiceMock.resolveRetrieveByDefendantIdToEmptyList()
        draftStoreServiceMock.resolveFind('claim')
        draftStoreServiceMock.resolveFindNoDraftFound()

        await request(app)
          .get(AppPaths.receiver.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.redirect.toLocation(DashboardPaths.dashboardPage.uri))
      })

      it('when no claim issued or received and no drafts (new claimant) should redirect to start page', async () => {
        idamServiceMock.resolveRetrieveUserFor('1', 'citizen')
        claimStoreServiceMock.resolveRetrieveByClaimantIdToEmptyList()
        claimStoreServiceMock.resolveRetrieveByDefendantIdToEmptyList()
        draftStoreServiceMock.resolveFindNoDraftFound()
        draftStoreServiceMock.resolveFindNoDraftFound()

        await request(app)
          .get(AppPaths.receiver.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.redirect.toLocation(EligibilityPaths.startPage.uri))
      })

      it('should return 500 and render error page when cannot retrieve claim drafts', async () => {
        idamServiceMock.resolveRetrieveUserFor('1', 'citizen')
        claimStoreServiceMock.resolveRetrieveByClaimantIdToEmptyList()
        claimStoreServiceMock.resolveRetrieveByDefendantIdToEmptyList()
        draftStoreServiceMock.resolveFindNoDraftFound()
        draftStoreServiceMock.rejectFind('HTTP error')

        await request(app)
          .get(AppPaths.receiver.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.serverError.withText('Error'))
      })

      it('when claim received and draft response exists, should redirect to dashboard', async () => {
        idamServiceMock.resolveRetrieveUserFor('1', 'citizen', 'letter-1')
        claimStoreServiceMock.resolveRetrieveByClaimantIdToEmptyList()
        claimStoreServiceMock.resolveRetrieveByDefendantId('000MC001')
        draftStoreServiceMock.resolveFindNoDraftFound()
        draftStoreServiceMock.resolveFind('claim')

        await request(app)
          .get(AppPaths.receiver.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.redirect
            .toLocation(DashboardPaths.dashboardPage.uri))
      })

      it('when claim received first time, should redirect to dashboard', async () => {
        idamServiceMock.resolveRetrieveUserFor('1', 'citizen', 'letter-1')
        claimStoreServiceMock.resolveRetrieveByClaimantIdToEmptyList()
        claimStoreServiceMock.resolveRetrieveByDefendantId('000MC001')
        draftStoreServiceMock.resolveFindNoDraftFound()
        draftStoreServiceMock.resolveFindNoDraftFound()

        await request(app)
          .get(AppPaths.receiver.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.redirect
            .toLocation(DashboardPaths.dashboardPage.uri))
      })
    })

    describe('when defendant starts response journey', () => {
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
        claimStoreServiceMock.resolveRetrieveByClaimantIdToEmptyList()
        claimStoreServiceMock.resolveRetrieveByDefendantId('000MC001')
        draftStoreServiceMock.resolveFindNoDraftFound()
        draftStoreServiceMock.resolveFind('claim')
        claimStoreServiceMock.resolveLinkDefendant()

        await request(app)
          .get(AppPaths.receiver.uri + '?state=123')
          .set('Cookie', [`${cookieName}=ABC`, 'lid=lasjlfkkjlef'])
          .expect(res => expect(res).to.be.redirect.toLocation(DashboardPaths.dashboardPage.uri))
      })

      it('For expired user credentials with valid input should redirect to login', async () => {
        const token = 'I am dummy access token'
        idamServiceMock.rejectExchangeCode(token)

        await request(app)
          .get(`${AppPaths.receiver.uri}?code=ABC&state=123`)
          .set('Cookie', 'state=123')
          .expect(res => expect(res).to.be.redirect.toLocation(/.*\/login.*/))
      })

      it('For expired user credentials should return error otherwise', async () => {
        await request(app)
          .get(`${AppPaths.receiver.uri}?code=ABC&state=123`)
          .set('Cookie', 'state=123')
          .expect(res => expect(res).to.be.serverError)
      })
    })

    describe('when LD if Off', () => {
      beforeEach(() => {
        isDashboardPaginationEnabledStub = sinon.stub(FeatureToggles.prototype, 'isDashboardPaginationEnabled')
        isDashboardPaginationEnabledStub.returns(false)
      })

      afterEach(() => {
        isDashboardPaginationEnabledStub.restore()
      })

      it('when claim received first time, should redirect to dashboard', async () => {
        idamServiceMock.resolveRetrieveUserFor('1', 'citizen', 'letter-1')
        claimStoreServiceMock.resolveRetrieveByClaimantIdToEmptyList()
        claimStoreServiceMock.resolveRetrieveByDefendantId('000MC001')
        draftStoreServiceMock.resolveFindNoDraftFound()
        draftStoreServiceMock.resolveFind('claim')
        claimStoreServiceMock.resolveLinkDefendant()

        await request(app)
          .get(AppPaths.receiver.uri + '?state=123')
          .set('Cookie', [`${cookieName}=ABC`, 'lid=lasjlfkkjlef'])
          .expect(res => expect(res).to.be.redirect.toLocation(DashboardPaths.dashboardPage.uri))
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
