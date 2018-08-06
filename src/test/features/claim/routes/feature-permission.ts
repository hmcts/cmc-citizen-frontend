import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'

import { attachDefaultHooks } from 'test/routes/hooks'
import 'test/routes/expectations'
import { checkAuthorizationGuards } from 'test/features/claim/routes/checks/authorization-check'
import { checkEligibilityGuards } from 'test/features/claim/routes/checks/eligibility-check'
import * as draftStoreServiceMock from 'test/http-mocks/draft-store'
import { Paths as ClaimPaths } from 'claim/paths'

import { app } from 'main/app'

import * as claimStoreServiceMock from 'test/http-mocks/claim-store'
import * as idamServiceMock from 'test/http-mocks/idam'

const cookieName: string = config.get<string>('session.cookieName')

const pagePath: string = ClaimPaths.newFeatureConsent.uri

describe('Feature permission: Claimant permission to try new features', () => {
  attachDefaultHooks(app)

  describe('on GET', () => {
    checkAuthorizationGuards(app, 'get', pagePath)
    checkEligibilityGuards(app, 'get', pagePath)

    it('should render feature permission page when everything is fine', async () => {
      idamServiceMock.resolveRetrieveUserFor('1', 'citizen')
      draftStoreServiceMock.resolveFind('claim')
      await request(app)
        .get(pagePath)
        .set('Cookie', `${cookieName}=ABC`)
        .expect(res => expect(res).to.be.successful.withText('I’ll try new features'))
    })
  })

  describe('on POST', () => {
    checkAuthorizationGuards(app, 'post', pagePath)
    checkEligibilityGuards(app, 'post', pagePath)

    describe('for authorized user', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor('1', 'citizen')
      })

      it('should render page with error when no selection is made', async () => {
        draftStoreServiceMock.resolveFind('claim')

        await request(app)
          .post(pagePath)
          .set('Cookie', `${cookieName}=ABC`)
          .send({ permissionResponse: undefined })
          .expect(res => expect(res).to.be.successful.withText('I’ll try new features', 'div class="error-summary"'))
      })

      it('should redirect to task list page when selection is made', async () => {
        draftStoreServiceMock.resolveFind('claim')
        claimStoreServiceMock.resolvePersistUserRoles('cmc-new-features-consent-given')

        await request(app)
          .post(ClaimPaths.newFeatureConsent.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .send({ permissionResponse: 'yes' })
          .expect(res => expect(res).to.be.redirect.toLocation(ClaimPaths.taskListPage.uri))
      })
    })
  })
})
