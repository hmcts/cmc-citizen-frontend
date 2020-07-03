import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'

import 'test/routes/expectations'

import { Paths } from 'testing-support/paths'
import { Paths as ClaimPaths } from 'claim/paths'
import { app } from 'main/app'

import * as idamServiceMock from 'test/http-mocks/idam'
import * as draftStoreServiceMock from 'test/http-mocks/draft-store'
import * as claimStoreServiceMock from 'test/http-mocks/claim-store'

import { attachDefaultHooks } from 'test/routes/hooks'
import { checkAuthorizationGuards } from 'test/routes/authorization-check'
import { FeatureToggles } from 'utils/featureToggles'

const cookieName: string = config.get<string>('session.cookieName')
const pagePath: string = Paths.createClaimDraftPage.uri
const pageText: string = 'Create Claim Draft'
const draftSuccessful: string = ClaimPaths.checkAndSendPage.uri

describe('Testing Support: Create Claim Draft', () => {
  attachDefaultHooks(app)

  describe('on GET', () => {
    checkAuthorizationGuards(app, 'get', pagePath)

    context('when user authorised', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor('100', 'citizen')
      })

      it('should render page when everything is fine', async () => {
        await request(app)
          .get(pagePath)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.successful.withText(pageText))
      })
    })
  })

  describe('on POST', () => {
    checkAuthorizationGuards(app, 'post', pagePath)

    context('when user authorised', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor('100', 'citizen')
      })

      it('should return 500 and render error page when cannot retrieve claim draft', async () => {
        draftStoreServiceMock.rejectFind('HTTP Error')

        await request(app)
          .post(pagePath)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.serverError.withText('Error'))
      })

      it('should return 500 and render error page when cannot save claim draft', async () => {
        draftStoreServiceMock.resolveFind('claim')
        draftStoreServiceMock.rejectUpdate()

        await request(app)
          .post(pagePath)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.serverError.withText('Error'))
      })

      if (!FeatureToggles.isEnabled('autoEnrolIntoNewFeature')) {
        it('should return 500 and render error page when cannot save user roles', async () => {
          draftStoreServiceMock.resolveFind('claim')
          draftStoreServiceMock.resolveUpdate()
          claimStoreServiceMock.resolveRetrieveUserRoles()
          claimStoreServiceMock.rejectAddRolesToUser('error adding user role')

          await request(app)
            .post(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.serverError.withText('Error'))
        })

        it('should redirect to check and send page and new user role is added when everything else is fine', async () => {
          draftStoreServiceMock.resolveFind('claim')
          draftStoreServiceMock.resolveUpdate()
          claimStoreServiceMock.resolveRetrieveUserRoles()
          claimStoreServiceMock.resolveAddRolesToUser('cmc-new-features-consent-given')

          await request(app)
            .post(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.redirect
              .toLocation(draftSuccessful))
        })

        it('should redirect to check and send page when user role is already added and everything else is fine', async () => {
          draftStoreServiceMock.resolveFind('claim')
          draftStoreServiceMock.resolveUpdate()
          claimStoreServiceMock.resolveRetrieveUserRoles('cmc-new-features-consent-given')

          await request(app)
            .post(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.redirect
              .toLocation(draftSuccessful))
        })

        it('should redirect to check and send page and add new user role when required role is missing from list and everything else is fine', async () => {
          draftStoreServiceMock.resolveFind('claim')
          draftStoreServiceMock.resolveUpdate()
          claimStoreServiceMock.resolveRetrieveUserRoles('not-a-consent-role')
          claimStoreServiceMock.resolveAddRolesToUser('cmc-new-features-consent-given')
          await request(app)
            .post(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.redirect
              .toLocation(draftSuccessful))
        })
      } else {
        it('should redirect to check and send page without adding new user role as auto enroll feature is on when everything else is fine', async () => {
          draftStoreServiceMock.resolveFind('claim')
          draftStoreServiceMock.resolveUpdate()
          claimStoreServiceMock.resolveRetrieveUserRoles()

          await request(app)
            .post(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.redirect
              .toLocation(draftSuccessful))
        })

        it('should redirect to check and send page when user role is already added and auto enroll feature is on and everything else is fine', async () => {
          draftStoreServiceMock.resolveFind('claim')
          draftStoreServiceMock.resolveUpdate()
          claimStoreServiceMock.resolveRetrieveUserRoles('cmc-new-features-consent-given')

          await request(app)
            .post(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.redirect
              .toLocation(draftSuccessful))
        })

        it('should redirect to check and send page and do not add new user role when required role is missing from list and auto enroll feature is turned on and everything else is fine', async () => {
          draftStoreServiceMock.resolveFind('claim')
          draftStoreServiceMock.resolveUpdate()
          claimStoreServiceMock.resolveRetrieveUserRoles('not-a-consent-role')
          await request(app)
            .post(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.redirect
              .toLocation(draftSuccessful))
        })
      }
    })
  })
})
