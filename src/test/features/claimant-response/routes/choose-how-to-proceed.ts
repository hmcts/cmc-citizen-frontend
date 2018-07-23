import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'

import { attachDefaultHooks } from 'test/routes/hooks'
import 'test/routes/expectations'
import { checkAuthorizationGuards } from 'test/features/claim/routes/checks/authorization-check'

import { Paths } from 'claimant-response/paths'

import { app } from 'main/app'

import * as idamServiceMock from 'test/http-mocks/idam'
import * as draftStoreServiceMock from 'test/http-mocks/draft-store'
import * as claimStoreServiceMock from 'test/http-mocks/claim-store'

import { FormaliseRepaymentPlanOption } from 'features/claimant-response/form/models/formaliseRepaymentPlanOption'

const cookieName: string = config.get<string>('session.cookieName')
const pagePath: string = Paths.chooseHowToProceedPage.evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId })
const pageContent: string = 'Choose how to proceed'

describe('Claimant response: choose how to proceed page', () => {
  attachDefaultHooks(app)

  describe('on GET', () => {

    checkAuthorizationGuards(app, 'get', pagePath)

    describe('for authorized user', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor(claimStoreServiceMock.sampleClaimObj.submitterId, 'citizen')
      })

      it('should render page when everything is fine', async () => {
        draftStoreServiceMock.resolveFind('claimantResponse')
        claimStoreServiceMock.resolveRetrieveClaimByExternalId()
  
        await request(app)
          .get(pagePath)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.successful.withText(pageContent))
      })
    })

    
  })

  describe('on POST', () => {
    
    describe('authorization guards', () => {
      checkAuthorizationGuards(app, 'post', pagePath)
    })

    describe('for authorized user', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor(claimStoreServiceMock.sampleClaimObj.submitterId, 'citizen')
      })

      it('should render page when form is invalid and everything is fine', async () => {
        draftStoreServiceMock.resolveFind('claimantResponse')
        claimStoreServiceMock.resolveRetrieveClaimByExternalId()

        await request(app)
          .post(pagePath)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.successful.withText(pageContent, 'div class="error-summary"'))
      })

      it('should return 500 and render error page when form is valid and cannot save draft', async () => {
        draftStoreServiceMock.resolveFind('claimantResponse')
        claimStoreServiceMock.resolveRetrieveClaimByExternalId()
        draftStoreServiceMock.rejectSave()

        await request(app)
          .post(pagePath)
          .set('Cookie', `${cookieName}=ABC`)
          .send({ option: FormaliseRepaymentPlanOption.SIGN_SETTLEMENT_AGREEMENT.value })
          .expect(res => expect(res).to.be.serverError.withText('Error'))
      })

      it('should redirect to sign settlement agreement page when `signSettlementAgreement` is selected and everything is fine', async () => {
        draftStoreServiceMock.resolveFind('claimantResponse')
        claimStoreServiceMock.resolveRetrieveClaimByExternalId()
        draftStoreServiceMock.resolveSave()

        await request(app)
          .post(pagePath)
          .set('Cookie', `${cookieName}=ABC`)
          .send({ option: FormaliseRepaymentPlanOption.SIGN_SETTLEMENT_AGREEMENT.value })
          .expect(res => expect(res).to.be.redirect.toLocation(Paths.signSettlementAgreementPage.evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId })))
      })

      it('should redirect to total page when `requestCCJ` is selected and everything is fine', async () => {
        draftStoreServiceMock.resolveFind('claimantResponse')
        claimStoreServiceMock.resolveRetrieveClaimByExternalId()
        draftStoreServiceMock.resolveSave()

        await request(app)
          .post(pagePath)
          .set('Cookie', `${cookieName}=ABC`)
          .send({ option: FormaliseRepaymentPlanOption.REQUEST_COUNTY_COURT_JUDGEMENT.value })
          .expect(res => expect(res).to.be.redirect.toLocation(Paths.taskListPage.evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId })))
      })
    })
  })
})
