import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'

import { attachDefaultHooks } from 'test/routes/hooks'
import 'test/routes/expectations'
import { checkAuthorizationGuards } from 'test/features/claim/routes/checks/authorization-check'
import { checkEligibilityGuards } from 'test/features/claim/routes/checks/eligibility-check'
import * as idamServiceMock from 'test/http-mocks/idam'
import { Paths as ClaimPaths } from 'claim/paths'

import { app } from 'main/app'
import * as draftStoreServiceMock from 'test/http-mocks/draft-store'
import * as claimStoreServiceMock from 'test/http-mocks/claim-store'

const cookieName: string = config.get<string>('session.cookieName')
const externalId = claimStoreServiceMock.sampleClaimObj.externalId
const pagePath = ClaimPaths.initiatePaymentController.uri
const draftType = 'claim'
const roles = 'citizen'

describe('Claim: Initiate payment page', () => {
  attachDefaultHooks(app)

  describe('on GET', () => {
    checkAuthorizationGuards(app, 'get', pagePath)
    checkEligibilityGuards(app, 'get', pagePath)

    it('should redirect to nextUrl returned by initiate payment if claim is not found', async () => {
      idamServiceMock.resolveRetrieveUserFor('1', roles)
      draftStoreServiceMock.resolveFind(draftType, { externalId })
      claimStoreServiceMock.resolveRetrieveClaimByExternalIdTo404HttpCode()
      claimStoreServiceMock.resolveInitiatePayment({ nextUrl: 'http://payment-api-initiate' })
      await request(app)
        .get(pagePath)
        .set('Cookie', `${cookieName}=ABC`)
        .expect(res => expect(res).to.be.redirect.toLocation('http://payment-api-initiate'))
    })

    it('should redirect to nextUrl returned by resume payment if claim is in AWAITING_CITIZEN_PAYMENT state', async () => {
      idamServiceMock.resolveRetrieveUserFor('1', roles)
      draftStoreServiceMock.resolveFind(draftType, { externalId })
      claimStoreServiceMock.resolveRetrieveClaimByExternalId({ externalId, state: 'AWAITING_CITIZEN_PAYMENT' })
      claimStoreServiceMock.resolveResumePayment({ nextUrl: 'http://payment-api-resume' })

      await request(app)
        .get(pagePath)
        .set('Cookie', `${cookieName}=ABC`)
        .expect(res => expect(res).to.be.redirect.toLocation('http://payment-api-resume'))
    })

    it('should redirect to confirmation page if claim is not in AWAITING_CITIZEN_PAYMENT state', async () => {
      idamServiceMock.resolveRetrieveUserFor('1', roles)
      draftStoreServiceMock.resolveFind(draftType, { externalId })
      claimStoreServiceMock.resolveRetrieveClaimByExternalId({ externalId, state: 'CREATE' })

      await request(app)
        .get(pagePath)
        .set('Cookie', `${cookieName}=ABC`)
        .expect(res => expect(res).to.be.redirect.toLocation(ClaimPaths.confirmationPage.evaluateUri({ externalId })))
    })
  })
})
