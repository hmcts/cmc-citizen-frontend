import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'

import { attachDefaultHooks } from 'test/routes/hooks'
import 'test/routes/expectations'
import { checkAuthorizationGuards } from 'test/features/claim/routes/checks/authorization-check'
import { checkEligibilityGuards } from 'test/features/claim/routes/checks/eligibility-check'

import { Paths as ClaimPaths } from 'claim/paths'

import { app } from 'main/app'

import * as idamServiceMock from 'test/http-mocks/idam'
import * as draftStoreServiceMock from 'test/http-mocks/draft-store'
import * as claimStoreServiceMock from 'test/http-mocks/claim-store'
import { FeatureToggles } from 'utils/featureToggles'
import * as sinon from 'sinon'

const cookieName: string = config.get<string>('session.cookieName')

describe('Claim issue: task list page', () => {
  attachDefaultHooks(app)

  describe('on GET', () => {
    let isAutoEnrollIntoNewFeatureEnabledStub: sinon.SinonStub
    checkAuthorizationGuards(app, 'get', ClaimPaths.incompleteSubmissionPage.uri)
    checkEligibilityGuards(app, 'get', ClaimPaths.incompleteSubmissionPage.uri)

    beforeEach(() => {
      isAutoEnrollIntoNewFeatureEnabledStub = sinon.stub(FeatureToggles.prototype, 'isAutoEnrollIntoNewFeatureEnabled')
    })

    afterEach(() => {
      isAutoEnrollIntoNewFeatureEnabledStub.restore()
    })

    it('should render page when everything is fine when user role present', async () => {
      isAutoEnrollIntoNewFeatureEnabledStub.returns(false)
      idamServiceMock.resolveRetrieveUserFor('1', 'citizen')
      draftStoreServiceMock.resolveFind('claim')
      claimStoreServiceMock.resolveRetrieveUserRoles('cmc-new-features-consent-given')

      await request(app)
        .get(ClaimPaths.taskListPage.uri)
        .set('Cookie', `${cookieName}=ABC`)
        .expect(res => expect(res).to.be.successful.withText('Make a money claim'))
    })

    it('should show error page when user role cannot be retrieved', async () => {
      isAutoEnrollIntoNewFeatureEnabledStub.returns(false)
      idamServiceMock.resolveRetrieveUserFor('1', 'citizen')
      draftStoreServiceMock.resolveFind('claim')
      claimStoreServiceMock.rejectRetrieveUserRoles()
      await request(app)
        .get(ClaimPaths.taskListPage.uri)
        .set('Cookie', `${cookieName}=ABC`)
        .expect(res => expect(res).to.be.serverError.withText('error'))
    })

    it('should render page redirect to feature consent page when no role present', async () => {
      isAutoEnrollIntoNewFeatureEnabledStub.returns(false)
      idamServiceMock.resolveRetrieveUserFor('1', 'citizen')
      draftStoreServiceMock.resolveFind('claim')
      claimStoreServiceMock.resolveRetrieveUserRoles()

      await request(app)
        .get(ClaimPaths.taskListPage.uri)
        .set('Cookie', `${cookieName}=ABC`)
        .expect(res => expect(res).to.be.redirect.toLocation(ClaimPaths.newFeaturesConsentPage.uri))
    })

    it('should render page and display number of sections completed and number of secsions pending', async () => {
      idamServiceMock.resolveRetrieveUserFor('1', 'citizen')
      draftStoreServiceMock.resolveFind('claim')
      claimStoreServiceMock.resolveRetrieveUserRoles('cmc-new-features-consent-given')

      await request(app)
        .get(ClaimPaths.taskListPage.uri)
        .set('Cookie', `${cookieName}=ABC`)
        .expect(res => expect(res).to.be.successful.withText('Make a money claim', 'Application incomplete', 'You have completed 6 of 7 sections'))
    })

    it('should render page when everything is fine when auto enroll feature is turned on', async () => {
      isAutoEnrollIntoNewFeatureEnabledStub.returns(true)
      idamServiceMock.resolveRetrieveUserFor('1', 'citizen')
      draftStoreServiceMock.resolveFind('claim')

      await request(app)
        .get(ClaimPaths.taskListPage.uri)
        .set('Cookie', `${cookieName}=ABC`)
        .expect(res => expect(res).to.be.successful.withText('Make a money claim'))
    })
  })
})
