import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'

import { attachDefaultHooks } from 'test/routes/hooks'
import 'test/routes/expectations'
import { checkAuthorizationGuards } from 'test/features/claim/routes/checks/authorization-check'
import { Paths as ClaimPaths } from 'claim/paths'

import { app } from 'main/app'

import * as claimStoreServiceMock from 'test/http-mocks/claim-store'
import * as idamServiceMock from 'test/http-mocks/idam'

const cookieName: string = config.get<string>('session.cookieName')

const pagePath: string = ClaimPaths.newFeaturesConsentPage.uri

describe('New features consent: opt-in to new features', () => {
  attachDefaultHooks(app)

  describe('on GET', () => {
    checkAuthorizationGuards(app, 'get', pagePath)

    describe('for authorized user', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor('1', 'citizen')
      })

      it('should render page when user role not present and everything is fine', async () => {
        claimStoreServiceMock.resolveRetrieveUserRoles()
        await request(app)
          .get(pagePath)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.successful.withText('Try new features'))
      })

      it('should not render page when new feature consent role present', async () => {
        claimStoreServiceMock.resolveRetrieveUserRoles('cmc-new-features-consent-given')
        await request(app)
          .get(pagePath)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.redirect.toLocation(ClaimPaths.taskListPage.uri))
      })

      it('should return 500 when role cannot be retrieved', async () => {
        claimStoreServiceMock.rejectRetrieveUserRoles()

        await request(app)
          .get(ClaimPaths.newFeaturesConsentPage.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.serverError.withText('error'))
      })
    })
  })

  describe('on POST', () => {
    checkAuthorizationGuards(app, 'post', pagePath)

    describe('for authorized user', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor('1', 'citizen')
      })

      it('should render page with error when no selection is made', async () => {
        claimStoreServiceMock.resolveRetrieveUserRoles()

        await request(app)
          .post(pagePath)
          .set('Cookie', `${cookieName}=ABC`)
          .send({ consentResponse: undefined })
          .expect(res => expect(res).to.be.successful.withText('Try new features', 'div class="error-summary"'))
      })

      it('should redirect to task list page when selection is made', async () => {
        claimStoreServiceMock.resolveRetrieveUserRoles()
        claimStoreServiceMock.resolveAddRolesToUser('cmc-new-features-consent-given')

        await request(app)
          .post(ClaimPaths.newFeaturesConsentPage.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .send({ consentResponse: 'yes' })
          .expect(res => expect(res).to.be.redirect.toLocation(ClaimPaths.taskListPage.uri))
      })

      it('should return 500 when role cannot be retrieved', async () => {
        claimStoreServiceMock.rejectRetrieveUserRoles()

        await request(app)
          .post(ClaimPaths.newFeaturesConsentPage.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .send({ consentResponse: 'yes' })
          .expect(res => expect(res).to.be.serverError.withText('error'))
      })

      it('should return 500 when role cannot be saved', async () => {
        claimStoreServiceMock.resolveRetrieveUserRoles()
        claimStoreServiceMock.rejectAddRolesToUser()

        await request(app)
          .post(ClaimPaths.newFeaturesConsentPage.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .send({ consentResponse: 'yes' })
          .expect(res => expect(res).to.be.serverError.withText('error'))
      })
    })
  })
})
