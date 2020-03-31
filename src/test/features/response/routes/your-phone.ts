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

import { checkCountyCourtJudgmentRequestedGuard } from 'test/common/checks/ccj-requested-check'
import { checkNotDefendantInCaseGuard } from 'test/common/checks/not-defendant-in-case-check'
import {
  verifyRedirectForGetWhenAlreadyPaidInFull,
  verifyRedirectForPostWhenAlreadyPaidInFull
} from 'test/app/guards/alreadyPaidInFullGuard'

const cookieName: string = config.get<string>('session.cookieName')
const pagePath = ResponsePaths.defendantPhonePage.evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId })
const headerText: string = 'Enter a phone number (optional)'

describe('Defendant user details: your phone page', () => {
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
        beforeEach(() => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId()
        })

        it('should render page when everything is fine', async () => {
          draftStoreServiceMock.resolveFind('response')
          draftStoreServiceMock.resolveFind('mediation')

          await request(app)
            .get(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.successful.withText(headerText))
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
        beforeEach(() => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId()
        })

        context('when form is invalid', () => {
          it('should render page when everything is fine', async () => {
            draftStoreServiceMock.resolveFind('response')
            draftStoreServiceMock.resolveFind('mediation')

            await request(app)
              .post(pagePath)
              .set('Cookie', `${cookieName}=ABC`)
              .expect(res => expect(res).to.be.successful.withText(headerText, 'div class="error-summary"'))
          })
        })

        context('when form is valid', () => {
          it('should return 500 and render error page when cannot save draft', async () => {
            draftStoreServiceMock.resolveFind('response')
            draftStoreServiceMock.resolveFind('mediation')
            draftStoreServiceMock.rejectUpdate()

            await request(app)
              .post(pagePath)
              .set('Cookie', `${cookieName}=ABC`)
              .send({ number: '07123456789' })
              .expect(res => expect(res).to.be.serverError.withText('Error'))
          })

          it('should redirect to task list page when everything is fine', async () => {
            draftStoreServiceMock.resolveFind('response')
            draftStoreServiceMock.resolveFind('mediation')
            draftStoreServiceMock.resolveUpdate()
            draftStoreServiceMock.resolveUpdate()

            await request(app)
              .post(pagePath)
              .set('Cookie', `${cookieName}=ABC`)
              .send({ number: '07123456789' })
              .expect(res => expect(res).to.be.redirect
                .toLocation(ResponsePaths.taskListPage
                  .evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId })))
          })
        })
      })
    })
  })
})
