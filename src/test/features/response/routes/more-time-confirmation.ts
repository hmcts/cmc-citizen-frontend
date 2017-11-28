import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'

import { attachDefaultHooks } from '../../../routes/hooks'
import { checkAuthorizationGuards } from './checks/authorization-check'
import { checkAlreadySubmittedGuard } from './checks/already-submitted-check'

import { Paths as ResponsePaths } from 'response/paths'

import { app } from '../../../../main/app'

import * as idamServiceMock from '../../../http-mocks/idam'
import * as draftStoreServiceMock from '../../../http-mocks/draft-store'
import * as claimStoreServiceMock from '../../../http-mocks/claim-store'

import { MoreTimeNeededOption } from 'response/form/models/moreTimeNeeded'
import { checkCountyCourtJudgmentRequestedGuard } from './checks/ccj-requested-check'
import { checkNotDefendantInCaseGuard } from './checks/not-defendant-in-case-check'

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
        idamServiceMock.resolveRetrieveUserFor(claimStoreServiceMock.sampleClaimObj.defendantId, 'cmc-private-beta')
      })

      checkAlreadySubmittedGuard(app, method, pagePath)
      checkCountyCourtJudgmentRequestedGuard(app, method, pagePath)

      context('when response not submitted', () => {
        describe('should redirect to request more time page', () => {
          it('when no option is selected', async () => {
            claimStoreServiceMock.resolveRetrieveClaimByExternalId()
            draftStoreServiceMock.resolveFind('response', { moreTimeNeeded: { option: undefined } })

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

            await request(app)
              .get(pagePath)
              .set('Cookie', `${cookieName}=ABC`)
              .expect(res => expect(res).to.redirect
                .toLocation(ResponsePaths.moreTimeRequestPage
                  .evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId })))
          })
        })

        it('should render confirmation page when answer is "yes" and everything is fine', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId()
          draftStoreServiceMock.resolveFind('response', { moreTimeNeeded: { option: MoreTimeNeededOption.YES } })

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
        idamServiceMock.resolveRetrieveUserFor(claimStoreServiceMock.sampleClaimObj.defendantId, 'cmc-private-beta')
      })

      checkAlreadySubmittedGuard(app, method, pagePath)
      checkCountyCourtJudgmentRequestedGuard(app, method, pagePath)

      context('when response not submitted', () => {
        beforeEach(() => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId()
        })

        describe('should redirect to request more time page', () => {
          it('when no option is selected', async () => {
            draftStoreServiceMock.resolveFind('response', { moreTimeNeeded: { option: undefined } })

            await request(app)
              .post(pagePath)
              .set('Cookie', `${cookieName}=ABC`)
              .expect(res => expect(res).to.redirect
                .toLocation(ResponsePaths.moreTimeRequestPage
                  .evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId })))
          })

          it('when answer is "no', async () => {
            draftStoreServiceMock.resolveFind('response', { moreTimeNeeded: { option: MoreTimeNeededOption.NO } })

            await request(app)
              .post(pagePath)
              .set('Cookie', `${cookieName}=ABC`)
              .expect(res => expect(res).to.redirect
                .toLocation(ResponsePaths.moreTimeRequestPage
                  .evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId })))
          })
        })

        it('should redirect to task list page when "yes" selected and everything is fine', async () => {
          draftStoreServiceMock.resolveFind('response', { moreTimeNeeded: { option: MoreTimeNeededOption.YES } })

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
