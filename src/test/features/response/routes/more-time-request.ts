import { expect } from 'chai'
import * as request from 'supertest'
import * as HttpStatus from 'http-status-codes'
import * as config from 'config'

import { attachDefaultHooks } from 'test/routes/hooks'
import { checkAuthorizationGuards } from 'test/common/checks/authorization-check'
import { checkAlreadySubmittedGuard } from 'test/common/checks/already-submitted-check'

import { Paths as ResponsePaths } from 'response/paths'
import { app } from 'main/app'

import * as idamServiceMock from 'test/http-mocks/idam'
import * as draftStoreServiceMock from 'test/http-mocks/draft-store'
import * as claimStoreServiceMock from 'test/http-mocks/claim-store'

import { MoreTimeNeededOption } from 'response/form/models/moreTimeNeeded'
import { checkCountyCourtJudgmentRequestedGuard } from 'test/common/checks/ccj-requested-check'
import { checkNotDefendantInCaseGuard } from 'test/common/checks/not-defendant-in-case-check'
import {
  verifyRedirectForGetWhenAlreadyPaidInFull,
  verifyRedirectForPostWhenAlreadyPaidInFull
} from 'test/app/guards/alreadyPaidInFullGuard'

const cookieName: string = config.get<string>('session.cookieName')
const pagePath = ResponsePaths.moreTimeRequestPage.evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId })

describe('Defendant response: more time needed page', () => {
  attachDefaultHooks(app)

  describe('on GET', () => {
    const method = 'get'
    checkAuthorizationGuards(app, method, pagePath)
    checkNotDefendantInCaseGuard(app, method, pagePath)

    context('when user authorised', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor(claimStoreServiceMock.sampleClaimObj.defendantId, 'citizen')
      })

      checkAlreadySubmittedGuard(app, method, pagePath)
      checkCountyCourtJudgmentRequestedGuard(app, method, pagePath)
      verifyRedirectForGetWhenAlreadyPaidInFull(pagePath)

      context('when response not submitted', () => {
        describe('should render editable page', async () => {
          it('when no option selected', async () => {
            draftStoreServiceMock.resolveFind('response', { moreTimeNeeded: { option: undefined } })
            draftStoreServiceMock.resolveFind('mediation')
            claimStoreServiceMock.resolveRetrieveClaimByExternalId()
            claimStoreServiceMock.resolvePostponedDeadline('2020-01-01')

            await request(app)
              .get(pagePath)
              .set('Cookie', `${cookieName}=ABC`)
              .expect(res => expect(res).to.be.successful.withText('Do you want more time to respond?',
                'You’ll have to respond before 4pm on 1 January 2020'))
          })

          it('when answer is "no"', async () => {
            draftStoreServiceMock.resolveFind('response', { moreTimeNeeded: { option: MoreTimeNeededOption.NO } })
            draftStoreServiceMock.resolveFind('mediation')
            claimStoreServiceMock.resolveRetrieveClaimByExternalId()
            claimStoreServiceMock.resolvePostponedDeadline('2020-01-01')

            await request(app)
              .get(pagePath)
              .set('Cookie', `${cookieName}=ABC`)
              .expect(res => expect(res).to.be.successful.withText('Do you want more time to respond?',
                'You’ll have to respond before 4pm on 1 January 2020'))
          })

          it('when deadline calculation fails', async () => {
            draftStoreServiceMock.resolveFind('response')
            draftStoreServiceMock.resolveFind('mediation')
            claimStoreServiceMock.resolveRetrieveClaimByExternalId()
            claimStoreServiceMock.rejectPostponedDeadline()

            await request(app)
              .get(pagePath)
              .set('Cookie', `${cookieName}=ABC`)
              .expect(res => expect(res).to.be.serverError.withText('Error'))
          })
        })

        it('should redirect to confirmation page when answer is "yes"', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId({ moreTimeRequested: true })
          draftStoreServiceMock.resolveFind('response', { moreTimeNeeded: { option: MoreTimeNeededOption.YES } })
          draftStoreServiceMock.resolveFind('mediation')

          await request(app)
            .get(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.redirect
              .toLocation(ResponsePaths.moreTimeConfirmationPage
                .evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId })))
        })
      })
    })
  })

  describe('on POST', () => {
    const method = 'post'
    checkAuthorizationGuards(app, method, pagePath)
    checkNotDefendantInCaseGuard(app, method, pagePath)

    context('when user authorised', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor(claimStoreServiceMock.sampleClaimObj.defendantId, 'citizen')
      })

      checkAlreadySubmittedGuard(app, method, pagePath)
      checkCountyCourtJudgmentRequestedGuard(app, method, pagePath)
      verifyRedirectForPostWhenAlreadyPaidInFull(pagePath)

      context('when response not submitted', () => {
        it('should redirect to confirmation page when more time already requested', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId({ moreTimeRequested: true })
          draftStoreServiceMock.resolveFind('response', { moreTimeNeeded: { option: undefined } })
          draftStoreServiceMock.resolveFind('mediation')

          await request(app)
            .post(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.redirect
              .toLocation(ResponsePaths.moreTimeConfirmationPage
                .evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId })))
        })

        context('when form is invalid', () => {
          it('should render page when everything is fine', async () => {
            claimStoreServiceMock.resolveRetrieveClaimByExternalId({ moreTimeRequested: false })
            draftStoreServiceMock.resolveFind('response', { moreTimeNeeded: { option: undefined } })
            draftStoreServiceMock.resolveFind('mediation')
            claimStoreServiceMock.resolvePostponedDeadline('2020-01-01')

            await request(app)
              .post(pagePath)
              .set('Cookie', `${cookieName}=ABC`)
              .expect(HttpStatus.OK)
              .expect(res => expect(res.text).to.include('Do you want more time to respond?', 'div class="error-summary"'))
          })
        })

        context('when form is valid', () => {
          it('should redirect to task list page when "no" is selected and everything is fine', async () => {
            claimStoreServiceMock.resolveRetrieveClaimByExternalId()
            draftStoreServiceMock.resolveFind('response', { moreTimeNeeded: { option: undefined } })
            draftStoreServiceMock.resolveFind('mediation')
            draftStoreServiceMock.resolveUpdate()

            await request(app)
              .post(pagePath)
              .set('Cookie', `${cookieName}=ABC`)
              .send({ option: 'no' })
              .expect(res => expect(res).to.redirect
                .toLocation(ResponsePaths.taskListPage
                  .evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId })))
          })

          it('should redirect to confirmation page page when "yes" is selected and everything is fine', async () => {
            claimStoreServiceMock.resolveRetrieveClaimByExternalId()
            draftStoreServiceMock.resolveFind('response', { moreTimeNeeded: { option: undefined } })
            draftStoreServiceMock.resolveFind('mediation')
            draftStoreServiceMock.resolveUpdate()
            claimStoreServiceMock.resolveRequestForMoreTime()

            await request(app)
              .post(pagePath)
              .set('Cookie', `${cookieName}=ABC`)
              .send({ option: 'yes' })
              .expect(res => expect(res).to.redirect
                .toLocation(ResponsePaths.moreTimeConfirmationPage
                  .evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId })))
          })

          it('should return 500 and render error page when "yes" is selected and cannot save draft', async () => {
            claimStoreServiceMock.resolveRetrieveClaimByExternalId()
            draftStoreServiceMock.resolveFind('response', { moreTimeNeeded: { option: undefined } })
            draftStoreServiceMock.resolveFind('mediation')
            draftStoreServiceMock.rejectUpdate()

            await request(app)
              .post(pagePath)
              .set('Cookie', `${cookieName}=ABC`)
              .send({ option: 'yes' })
              .expect(res => expect(res).to.be.serverError.withText('Error'))
          })

          it('should return 500 when "yes" is selected and cannot retrieve claim', async () => {
            claimStoreServiceMock.rejectRetrieveClaimByExternalId('internal server error when retrieving claim')

            await request(app)
              .post(pagePath)
              .set('Cookie', `${cookieName}=ABC`)
              .send({ option: 'yes' })
              .expect(res => expect(res).to.be.serverError.withText('Error'))
          })

          it('should return 500 when "yes" is selected and cannot request more time', async () => {
            draftStoreServiceMock.resolveFind('response', { moreTimeNeeded: { option: undefined } })
            draftStoreServiceMock.resolveFind('mediation')
            draftStoreServiceMock.resolveUpdate()
            claimStoreServiceMock.resolveRetrieveClaimByExternalId()
            claimStoreServiceMock.rejectRequestForMoreTime('internal server error when requesting more time')

            await request(app)
              .post(pagePath)
              .set('Cookie', `${cookieName}=ABC`)
              .send({ option: 'yes' })
              .expect(res => expect(res).to.be.serverError.withText('Error'))
          })

          it('when deadline calculation fails', async () => {
            draftStoreServiceMock.resolveFind('response', { moreTimeNeeded: { option: undefined } })
            draftStoreServiceMock.resolveFind('mediation')
            claimStoreServiceMock.resolveRetrieveClaimByExternalId({ moreTimeRequested: false })
            claimStoreServiceMock.rejectPostponedDeadline()

            await request(app)
              .post(pagePath)
              .set('Cookie', `${cookieName}=ABC`)
              .expect(res => expect(res).to.be.serverError.withText('Error'))
          })
        })
      })
    })
  })
})
