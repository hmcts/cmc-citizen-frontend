import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'

import { attachDefaultHooks } from 'test/routes/hooks'
import 'test/routes/expectations'

import { Paths as ClaimantResponsePaths } from 'claimant-response/paths'

import { app } from 'main/app'

import * as idamServiceMock from 'test/http-mocks/idam'
import * as claimStoreServiceMock from 'test/http-mocks/claim-store'
import * as draftStoreServiceMock from 'test/http-mocks/draft-store'
import { checkAuthorizationGuards } from 'test/features/claimant-response/routes/checks/authorization-check'
import { checkNotClaimantInCaseGuard } from 'test/features/claimant-response/routes/checks/not-claimant-in-case-check'

const cookieName: string = config.get<string>('session.cookieName')
const externalId = claimStoreServiceMock.sampleClaimObj.externalId
const pagePath = ClaimantResponsePaths.defendantsResponsePage.evaluateUri({ externalId: externalId })
const taskListPagePath = ClaimantResponsePaths.taskListPage.evaluateUri({ externalId: externalId })

const fullAdmissionResponseWithPaymentBySetDate = claimStoreServiceMock.sampleFullAdmissionWithPaymentBySetDateResponseObj
const fullAdmissionResponseWithPaymentByInstalments = claimStoreServiceMock.sampleFullAdmissionWithPaymentByInstalmentsResponseObj
const partialAdmissionWithPaymentBySetDate = claimStoreServiceMock.samplePartialAdmissionWithPaymentBySetDateResponseObj
const fullDefenceWithStatesPaid = claimStoreServiceMock.sampleFullDefenceWithStatesPaidGreaterThanClaimAmount
const fullDefenceData = claimStoreServiceMock.sampleFullDefenceRejectEntirely

describe('Claimant response: view defendant response page', () => {
  attachDefaultHooks(app)

  describe('on GET', () => {
    const method = 'get'
    checkAuthorizationGuards(app, method, pagePath)
    checkNotClaimantInCaseGuard(app, method, pagePath)

    context('when user authorised', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor('1', 'citizen')
      })

      it('should return 500 and render error page when cannot retrieve claims', async () => {
        claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error')

        await request(app)
          .get(pagePath)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.serverError.withText('Error'))
      })

      it('should return 500 and render error page when cannot retrieve claimantResponse draft', async () => {
        draftStoreServiceMock.rejectFind('Error')
        claimStoreServiceMock.resolveRetrieveClaimByExternalId(fullAdmissionResponseWithPaymentByInstalments)

        await request(app)
          .get(pagePath)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.serverError.withText('Error'))
      })

      it('should render full admission with instalments page when everything is fine', async () => {
        claimStoreServiceMock.resolveRetrieveClaimByExternalId(fullAdmissionResponseWithPaymentByInstalments)
        draftStoreServiceMock.resolveFind('claimantResponse')

        await request(app)
          .get(pagePath)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.successful.withText('The defendant’s response'))
      })

      it('should render full admission with set date page when everything is fine', async () => {
        claimStoreServiceMock.resolveRetrieveClaimByExternalId(fullAdmissionResponseWithPaymentBySetDate)
        draftStoreServiceMock.resolveFind('claimantResponse')

        await request(app)
          .get(pagePath)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.successful.withText('The defendant’s response'))
      })

      it('should render part admission with SoM page when everything is fine', async () => {
        claimStoreServiceMock.resolveRetrieveClaimByExternalId(partialAdmissionWithPaymentBySetDate)
        draftStoreServiceMock.resolveFind('claimantResponse')

        await request(app)
          .get(pagePath)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.successful.withText('The defendant’s response'))
      })

      it('should render paid in full with stated amount when everything is fine', async () => {
        claimStoreServiceMock.resolveRetrieveClaimByExternalId(fullDefenceWithStatesPaid)
        draftStoreServiceMock.resolveFind('claimantResponse')

        await request(app)
          .get(pagePath)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.successful.withText(`£20,000`))
      })

      it('should render full defence with hearing requirements', async () => {
        const fullDefenceWithDQsEnabledData = {
          ...fullDefenceData,
          features : ['admissions', 'directionsQuestionnaire']
        }
        claimStoreServiceMock.resolveRetrieveClaimByExternalId(fullDefenceWithDQsEnabledData)
        draftStoreServiceMock.resolveFind('claimantResponse')

        await request(app)
          .get(pagePath)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.successful.withText(`has rejected the claim.`,
            `Download their full response and hearing requirements`))
      })

      it('should render part admission with hearing requirements', async () => {
        const partAdmissionWithDQsEnabledData = {
          ...partialAdmissionWithPaymentBySetDate,
          features : ['admissions', 'directionsQuestionnaire']
        }
        claimStoreServiceMock.resolveRetrieveClaimByExternalId(partAdmissionWithDQsEnabledData)
        draftStoreServiceMock.resolveFind('claimantResponse')

        await request(app)
          .get(pagePath)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.successful.withText(`They don’t believe they owe the full amount claimed.`))
      })
    })

    describe('on POST', () => {
      const method = 'post'
      checkAuthorizationGuards(app, method, pagePath)
      checkNotClaimantInCaseGuard(app, method, pagePath)

      context('when user authorised', () => {
        beforeEach(() => {
          idamServiceMock.resolveRetrieveUserFor('1', 'citizen')
        })

        context('when middleware failure', () => {
          it('should return 500 when cannot retrieve claim by external id', async () => {
            claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error')

            await request(app)
              .post(pagePath)
              .set('Cookie', `${cookieName}=ABC`)
              .send({ viewedDefendantResponse: true })
              .expect(res => expect(res).to.be.serverError.withText('Error'))
          })

          it('should return 500 when cannot retrieve claimantResponse draft', async () => {
            draftStoreServiceMock.rejectFind('Error')
            claimStoreServiceMock.resolveRetrieveClaimByExternalId(fullAdmissionResponseWithPaymentByInstalments)

            await request(app)
              .post(pagePath)
              .set('Cookie', `${cookieName}=ABC`)
              .send({ viewedDefendantResponse: true })
              .expect(res => expect(res).to.be.serverError.withText('Error'))
          })

          it('should return 500 and render error page when cannot save claimantResponse draft', async () => {
            claimStoreServiceMock.resolveRetrieveClaimByExternalId(fullAdmissionResponseWithPaymentByInstalments)
            draftStoreServiceMock.resolveFind('claimantResponse')
            draftStoreServiceMock.rejectUpdate()

            await request(app)
              .post(pagePath)
              .set('Cookie', `${cookieName}=ABC`)
              .send({ viewedDefendantResponse: true })
              .expect(res => expect(res).to.be.serverError.withText('Error'))
          })
        })

        it('should render second part admission page when pagination was requested and everything is fine', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId(partialAdmissionWithPaymentBySetDate)
          draftStoreServiceMock.resolveFind('claimantResponse')

          await request(app)
            .post(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .send({ action: { showPage: 1 } })
            .expect(res => expect(res).to.be.successful.withText('How they want to pay'))
        })

        it('should redirect to task list page when pagination was not requested and everything is fine', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId(fullAdmissionResponseWithPaymentByInstalments)
          draftStoreServiceMock.resolveFind('claimantResponse')
          draftStoreServiceMock.resolveUpdate()

          await request(app)
            .post(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .send({ viewedDefendantResponse: true })
            .expect(res => expect(res).to.be.redirect.toLocation(taskListPagePath))
        })

      })
    })
  })
})
