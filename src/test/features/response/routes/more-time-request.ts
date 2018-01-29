import { expect } from 'chai'
import * as request from 'supertest'
import * as HttpStatus from 'http-status-codes'
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

      context('when response not submitted', () => {
        beforeEach(() => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId()
        })

        describe('should render editable page', async () => {
          it('when no option selected', async () => {
            draftStoreServiceMock.resolveFind('response', { moreTimeNeeded: { option: undefined } })

            await request(app)
              .get(pagePath)
              .set('Cookie', `${cookieName}=ABC`)
              .expect(res => expect(res).to.be.successful.withText('Do you want more time to respond?'))
          })

          it('when answer is "no"', async () => {
            draftStoreServiceMock.resolveFind('response', { moreTimeNeeded: { option: MoreTimeNeededOption.NO } })

            await request(app)
              .get(pagePath)
              .set('Cookie', `${cookieName}=ABC`)
              .expect(res => expect(res).to.be.successful.withText('Do you want more time to respond?'))
          })
        })

        it('should redirect to confirmation page when answer is "yes"', async () => {
          draftStoreServiceMock.resolveFind('response', { moreTimeNeeded: { option: MoreTimeNeededOption.YES } })

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

      context('when response not submitted', () => {
        it('should redirect to confirmation page when already submitted answer is "yes"', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId()
          draftStoreServiceMock.resolveFind('response', { moreTimeNeeded: { option: MoreTimeNeededOption.YES } })

          await request(app)
            .post(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.redirect
              .toLocation(ResponsePaths.moreTimeConfirmationPage
                .evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId })))
        })

        context('when form is invalid', () => {
          it('should render page when everything is fine', async () => {
            claimStoreServiceMock.resolveRetrieveClaimByExternalId()
            draftStoreServiceMock.resolveFind('response', { moreTimeNeeded: { option: undefined } })

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
            draftStoreServiceMock.resolveSave()

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
            draftStoreServiceMock.resolveSave()
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
            draftStoreServiceMock.rejectSave()

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
            draftStoreServiceMock.resolveSave()
            claimStoreServiceMock.resolveRetrieveClaimByExternalId()
            claimStoreServiceMock.rejectRequestForMoreTime('internal server error when requesting more time')

            await request(app)
              .post(pagePath)
              .set('Cookie', `${cookieName}=ABC`)
              .send({ option: 'yes' })
              .expect(res => expect(res).to.be.serverError.withText('Error'))
          })
        })
      })
    })
  })
})
