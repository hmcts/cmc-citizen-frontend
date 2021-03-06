import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'

import { attachDefaultHooks } from 'test/routes/hooks'
import { checkAuthorizationGuards } from 'test/common/checks/authorization-check'

import * as idamServiceMock from 'test/http-mocks/idam'
import * as claimStoreServiceMock from 'test/http-mocks/claim-store'
import * as draftStoreServiceMock from 'test/http-mocks/draft-store'

import { StatementOfMeansPaths as Paths } from 'response/paths'
import { app } from 'main/app'
import { checkNotDefendantInCaseGuard } from 'test/common/checks/not-defendant-in-case-check'
import { checkCountyCourtJudgmentRequestedGuard } from 'test/common/checks/ccj-requested-check'
import { checkAlreadySubmittedGuard } from 'test/common/checks/already-submitted-check'
import {
  verifyRedirectForGetWhenAlreadyPaidInFull,
  verifyRedirectForPostWhenAlreadyPaidInFull
} from 'test/app/guards/alreadyPaidInFullGuard'

const cookieName: string = config.get<string>('session.cookieName')

const pagePath = Paths.introPage.evaluateUri({
  externalId: claimStoreServiceMock.sampleClaimObj.externalId
})

describe('Statement of means', () => {
  describe('Explain why cannot pay immediately page', () => {
    attachDefaultHooks(app)

    describe('on GET', () => {

      const method = 'get'
      checkAuthorizationGuards(app, method, pagePath)
      checkNotDefendantInCaseGuard(app, method, pagePath)

      context('when user authorised', () => {
        beforeEach(() => {
          idamServiceMock.resolveRetrieveUserFor(claimStoreServiceMock.sampleClaimObj.defendantId, 'citizen')
        })

        verifyRedirectForGetWhenAlreadyPaidInFull(pagePath)

        it('should return error page when unable to retrieve claim', async () => {
          claimStoreServiceMock.rejectRetrieveClaimByExternalId('Error')

          await request(app)
            .get(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.serverError.withText('Error'))
        })

        it('should return error page when unable to retrieve draft', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId()
          draftStoreServiceMock.rejectFind()

          await request(app)
            .get(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.serverError.withText('Error'))
        })

        it('should return successful response when claim is retrieved', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId()
          draftStoreServiceMock.resolveFind('response:full-admission')
          draftStoreServiceMock.resolveFind('mediation')

          await request(app)
            .get(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.successful.withText(
              'your financial detail'
            ))
        })
      })
    })

    describe('on POST', () => {
      const method = 'post'
      checkAuthorizationGuards(app, method, pagePath)
      checkNotDefendantInCaseGuard(app, method, pagePath)

      describe('for authorized user', () => {
        beforeEach(() => {
          idamServiceMock.resolveRetrieveUserFor(claimStoreServiceMock.sampleClaimObj.defendantId, 'citizen', 'defendant')
        })

        checkAlreadySubmittedGuard(app, method, pagePath)
        checkCountyCourtJudgmentRequestedGuard(app, method, pagePath)
        verifyRedirectForPostWhenAlreadyPaidInFull(pagePath)

        it('should return 500 and render error page when cannot save draft', async () => {
          draftStoreServiceMock.resolveFind('response:full-admission', { statementOfMeans: undefined })
          draftStoreServiceMock.resolveFind('mediation')
          draftStoreServiceMock.rejectUpdate()
          claimStoreServiceMock.resolveRetrieveClaimByExternalId()

          await request(app)
            .post(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.serverError.withText('Error'))
        })

        it('should redirect to task list when everything is fine', async () => {
          draftStoreServiceMock.resolveFind('response:full-admission', { statementOfMeans: undefined })
          draftStoreServiceMock.resolveFind('mediation')
          draftStoreServiceMock.resolveUpdate()
          claimStoreServiceMock.resolveRetrieveClaimByExternalId()

          await request(app)
            .post(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.redirect
              .toLocation(Paths.bankAccountsPage
                .evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId })))
        })
      })
    })
  })
})
