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
const cookieName: string = config.get<string>('session.cookieName')
const externalId = claimStoreServiceMock.sampleClaimObj.externalId
const pagePath = ClaimPaths.finishPaymentController.evaluateUri({ externalId })

describe('Claim issue: finish payment page', () => {
  attachDefaultHooks(app)

  describe('on GET', () => {
    checkAuthorizationGuards(app, 'get', pagePath)
    checkEligibilityGuards(app, 'get', pagePath)

    it('should redirect to check and send page if claim is not found', async () => {
      idamServiceMock.resolveRetrieveUserFor('1', 'citizen')
      draftStoreServiceMock.resolveFind('claim', { externalId })
      claimStoreServiceMock.resolveRetrieveClaimByExternalIdTo404HttpCode()
      await request(app)
        .get(pagePath)
        .set('Cookie', `${cookieName}=ABC`)
        .expect(res => expect(res).to.be.redirect.toLocation(ClaimPaths.checkAndSendPage.uri))
    })

    it('should create claim and redirect to check and send page if claim is in AWAITING_CITIZEN_PAYMENT state', async () => {
      idamServiceMock.resolveRetrieveUserFor('1', 'citizen')
      draftStoreServiceMock.resolveFind('claim', { externalId })
      claimStoreServiceMock.resolveRetrieveClaimByExternalId({ externalId, state: 'AWAITING_CITIZEN_PAYMENT' })
      claimStoreServiceMock.resolveRetrieveUserRoles()
      claimStoreServiceMock.resolveCreateClaimCitizen({ externalId, state: 'AWAITING_CITIZEN_PAYMENT' })

      await request(app)
        .get(pagePath)
        .set('Cookie', `${cookieName}=ABC`)
        .expect(res => expect(res).to.be.redirect.toLocation(ClaimPaths.checkAndSendPage.uri))
    })

    it('should create claim delete draft and redirect to confirmation page if created claim is not in AWAITING_CITIZEN_PAYMENT state', async () => {
      idamServiceMock.resolveRetrieveUserFor('1', 'citizen')
      draftStoreServiceMock.resolveFind('claim', { externalId })
      claimStoreServiceMock.resolveRetrieveClaimByExternalId({ externalId, state: 'AWAITING_CITIZEN_PAYMENT' })
      claimStoreServiceMock.resolveRetrieveUserRoles()
      claimStoreServiceMock.resolveCreateClaimCitizen({ externalId, state: 'OPEN' })
      draftStoreServiceMock.resolveDelete()

      await request(app)
        .get(pagePath)
        .set('Cookie', `${cookieName}=ABC`)
        .expect(res => expect(res).to.be.redirect.toLocation(ClaimPaths.confirmationPage.evaluateUri({ externalId })))
    })

    it('should delete draft and redirect to confirmation page if claim is not in AWAITING_CITIZEN_PAYMENT state', async () => {
      idamServiceMock.resolveRetrieveUserFor('1', 'citizen')
      draftStoreServiceMock.resolveFind('claim', { externalId })
      claimStoreServiceMock.resolveRetrieveClaimByExternalId({ externalId, state: 'OPEN' })

      await request(app)
        .get(pagePath)
        .set('Cookie', `${cookieName}=ABC`)
        .expect(res => expect(res).to.be.redirect.toLocation(ClaimPaths.confirmationPage.evaluateUri({ externalId })))
    })
  })
})
