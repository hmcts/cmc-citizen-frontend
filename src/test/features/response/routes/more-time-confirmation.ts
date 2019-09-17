import { expect } from 'chai'
import * as request from 'supertest'
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

const cookieName: string = config.get<string>('session.cookieName')
const pagePath = ResponsePaths.moreTimeConfirmationPage.evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId })

describe('Defendant response: more time needed - confirmation page', () => {
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

      context('when response not submitted', () => {
        describe('should redirect to request more time page', () => {
          it('when no option is selected', async () => {
            claimStoreServiceMock.resolveRetrieveClaimByExternalId()
            draftStoreServiceMock.resolveFind('response', { moreTimeNeeded: { option: undefined } })
            draftStoreServiceMock.resolveFind('mediation')

            await request(app)
              .get(pagePath)
              .set('Cookie', `${cookieName}=ABC`)
              .expect(res => expect(res).to.redirect
                .toLocation(ResponsePaths.moreTimeRequestPage
                  .evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId })))
          })

          it('when answer is "no"', async () => {
            claimStoreServiceMock.resolveRetrieveClaimByExternalId()
            draftStoreServiceMock.resolveFind('response', { moreTimeNeeded: { option: MoreTimeNeededOption.NO } })
            draftStoreServiceMock.resolveFind('mediation')

            await request(app)
              .get(pagePath)
              .set('Cookie', `${cookieName}=ABC`)
              .expect(res => expect(res).to.redirect
                .toLocation(ResponsePaths.moreTimeRequestPage
                  .evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId })))
          })
        })

        it('should render confirmation page when answer is "yes" and everything is fine', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId({ moreTimeRequested: true })
          draftStoreServiceMock.resolveFind('response', { moreTimeNeeded: { option: MoreTimeNeededOption.YES } })
          draftStoreServiceMock.resolveFind('mediation')

          await request(app)
            .get(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.successful.withText('You have an extra 14 days to respond'))
        })

        it('should render confirmation page when more time already requested on claim', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId({ moreTimeRequested: true })
          draftStoreServiceMock.resolveFind('response', { moreTimeNeeded: { option: undefined } })
          draftStoreServiceMock.resolveFind('mediation')

          await request(app)
            .get(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.successful.withText('You have an extra 14 days to respond'))
        })

        it('should return 500 and render error page when answer is "yes" and cannot retrieve claim', async () => {
          claimStoreServiceMock.rejectRetrieveClaimByExternalId('Internal server error')

          await request(app)
            .get(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.serverError.withText('Error'))
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

      context('when response not submitted', () => {
        describe('should redirect to request more time page', () => {
          it('when no option is selected', async () => {
            draftStoreServiceMock.resolveFind('response', { moreTimeNeeded: { option: undefined } })
            draftStoreServiceMock.resolveFind('mediation')
            claimStoreServiceMock.resolveRetrieveClaimByExternalId()

            await request(app)
              .post(pagePath)
              .set('Cookie', `${cookieName}=ABC`)
              .expect(res => expect(res).to.redirect
                .toLocation(ResponsePaths.moreTimeRequestPage
                  .evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId })))
          })

          it('when answer is "no', async () => {
            draftStoreServiceMock.resolveFind('response', { moreTimeNeeded: { option: MoreTimeNeededOption.NO } })
            draftStoreServiceMock.resolveFind('mediation')
            claimStoreServiceMock.resolveRetrieveClaimByExternalId()

            await request(app)
              .post(pagePath)
              .set('Cookie', `${cookieName}=ABC`)
              .expect(res => expect(res).to.redirect
                .toLocation(ResponsePaths.moreTimeRequestPage
                  .evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId })))
          })
        })

        it('should redirect to task list page when "yes" selected and everything is fine', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId({ moreTimeRequested: true })
          draftStoreServiceMock.resolveFind('response', { moreTimeNeeded: { option: MoreTimeNeededOption.YES } })
          draftStoreServiceMock.resolveFind('mediation')

          await request(app)
            .post(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.redirect
              .toLocation(ResponsePaths.taskListPage
                .evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId })))
        })
      })
    })
  })
})
