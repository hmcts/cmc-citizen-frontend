import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'

import { attachDefaultHooks } from 'test/routes/hooks'
import 'test/routes/expectations'
import { checkAuthorizationGuards } from 'test/common/checks/authorization-check'
import { checkAlreadySubmittedGuard } from 'test/common/checks/already-submitted-check'

import { Paths as ResponsePaths } from 'response/paths'
import { ResponseType } from 'response/form/models/responseType'

import { app } from 'main/app'

import * as idamServiceMock from 'test/http-mocks/idam'
import * as draftStoreServiceMock from 'test/http-mocks/draft-store'
import * as claimStoreServiceMock from 'test/http-mocks/claim-store'
import { checkNotDefendantInCaseGuard } from 'test/common/checks/not-defendant-in-case-check'
import { RejectAllOfClaimOption } from 'response/form/models/rejectAllOfClaim'
import {
  verifyRedirectForGetWhenAlreadyPaidInFull,
  verifyRedirectForPostWhenAlreadyPaidInFull
} from 'test/app/guards/alreadyPaidInFullGuard'

const cookieName: string = config.get<string>('session.cookieName')
const pagePath = ResponsePaths.defenceRejectAllOfClaimPage.evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId })

const draftOverride = {
  response: {
    type: ResponseType.DEFENCE
  }
}

describe('Defendant response: full admission options', () => {
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
      verifyRedirectForGetWhenAlreadyPaidInFull(pagePath)

      context('when response not submitted', () => {
        it('should return 500 and render error page when cannot retrieve claim', async () => {
          claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error')

          await request(app)
            .get(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.serverError.withText('Error'))
        })

        it('should redirect to response type page when response type is not full admission', async () => {
          draftStoreServiceMock.resolveFind('response', { response: { type: ResponseType.PART_ADMISSION } })
          draftStoreServiceMock.resolveFind('mediation')
          claimStoreServiceMock.resolveRetrieveClaimByExternalId()

          await request(app)
            .get(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.redirect.toLocation(ResponsePaths.responseTypePage
              .evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId })))
        })

        it('should render page when everything is fine', async () => {
          draftStoreServiceMock.resolveFind('response', draftOverride)
          claimStoreServiceMock.resolveRetrieveClaimByExternalId()
          draftStoreServiceMock.resolveFind('mediation')

          await request(app)
            .get(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.successful.withText('Why do you believe you don’t owe'))
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
      verifyRedirectForPostWhenAlreadyPaidInFull(pagePath)

      context('when response not submitted', () => {
        it('should redirect to response type page when response type is not full admission', async () => {
          draftStoreServiceMock.resolveFind('response', { response: { type: ResponseType.PART_ADMISSION } })
          draftStoreServiceMock.resolveFind('mediation')
          claimStoreServiceMock.resolveRetrieveClaimByExternalId()

          await request(app)
            .post(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.redirect.toLocation(ResponsePaths.responseTypePage
              .evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId })))
        })

        context('when form is invalid', () => {
          it('should return 500 and render error page when cannot retrieve claim', async () => {
            claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error')

            await request(app)
              .post(pagePath)
              .set('Cookie', `${cookieName}=ABC`)
              .expect(res => expect(res).to.be.serverError.withText('Error'))
          })

          it('should render page when everything is fine', async () => {
            draftStoreServiceMock.resolveFind('response', draftOverride)
            draftStoreServiceMock.resolveFind('mediation')
            claimStoreServiceMock.resolveRetrieveClaimByExternalId()

            await request(app)
              .post(pagePath)
              .set('Cookie', `${cookieName}=ABC`)
              .expect(res => expect(res).to.be.successful.withText('Why do you believe you don’t owe', 'div class="error-summary"'))
          })
        })

        context('when form is valid', () => {
          it('should return 500 and render error page when cannot save draft', async () => {
            claimStoreServiceMock.resolveRetrieveClaimByExternalId()
            draftStoreServiceMock.resolveFind('response', draftOverride)
            draftStoreServiceMock.resolveFind('mediation')
            draftStoreServiceMock.rejectUpdate()

            await request(app)
              .post(pagePath)
              .set('Cookie', `${cookieName}=ABC`)
              .send({ option: RejectAllOfClaimOption.ALREADY_PAID })
              .expect(res => expect(res).to.be.serverError.withText('Error'))
          })

          it('should redirect to how much paid claimant page when everything is fine', async () => {
            claimStoreServiceMock.resolveRetrieveClaimByExternalId()
            draftStoreServiceMock.resolveFind('response', draftOverride)
            draftStoreServiceMock.resolveFind('mediation')
            draftStoreServiceMock.resolveUpdate()

            await request(app)
              .post(pagePath)
              .set('Cookie', `${cookieName}=ABC`)
              .send({ option: RejectAllOfClaimOption.ALREADY_PAID })
              .expect(res => expect(res).to.be.redirect
                .toLocation(ResponsePaths.taskListPage
                  .evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId })))
          })

          it('should redirect to send your response by email page when counterclaim option is selected', async () => {
            claimStoreServiceMock.resolveRetrieveClaimByExternalId()
            draftStoreServiceMock.resolveFind('response', draftOverride)
            draftStoreServiceMock.resolveFind('mediation')
            draftStoreServiceMock.resolveUpdate()

            await request(app)
              .post(pagePath)
              .set('Cookie', `${cookieName}=ABC`)
              .send({ option: RejectAllOfClaimOption.COUNTER_CLAIM })
              .expect(res => expect(res).to.be.redirect
                .toLocation(ResponsePaths.sendYourResponseByEmailPage
                  .evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId })))
          })
        })
      })
    })
  })
})
