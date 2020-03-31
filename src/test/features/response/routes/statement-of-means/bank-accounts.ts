import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'
import 'test/routes/expectations'
import { StatementOfMeansPaths } from 'response/paths'
import * as idamServiceMock from 'test/http-mocks/idam'
import * as draftStoreServiceMock from 'test/http-mocks/draft-store'
import * as claimStoreServiceMock from 'test/http-mocks/claim-store'
import { attachDefaultHooks } from 'test/routes/hooks'
import { checkAuthorizationGuards } from 'test/common/checks/authorization-check'
import { checkAlreadySubmittedGuard } from 'test/common/checks/already-submitted-check'
import { checkCountyCourtJudgmentRequestedGuard } from 'test/common/checks/ccj-requested-check'
import { app } from 'main/app'
import { checkNotDefendantInCaseGuard } from 'test/common/checks/not-defendant-in-case-check'
import { BankAccountType } from 'response/form/models/statement-of-means/bankAccountType'
import {
  verifyRedirectForGetWhenAlreadyPaidInFull,
  verifyRedirectForPostWhenAlreadyPaidInFull
} from 'test/app/guards/alreadyPaidInFullGuard'

const cookieName: string = config.get<string>('session.cookieName')
const pagePath: string = StatementOfMeansPaths.bankAccountsPage.evaluateUri(
  { externalId: claimStoreServiceMock.sampleClaimObj.externalId }
)

describe('Defendant response: Statement of means: bank accounts', () => {

  attachDefaultHooks(app)

  describe('on GET', () => {

    const method = 'get'
    checkAuthorizationGuards(app, method, pagePath)
    checkNotDefendantInCaseGuard(app, method, pagePath)

    context('when user authorised', () => {

      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor(claimStoreServiceMock.sampleClaimObj.defendantId, 'citizen', 'defendant')
      })

      checkAlreadySubmittedGuard(app, method, pagePath)
      checkCountyCourtJudgmentRequestedGuard(app, method, pagePath)
      verifyRedirectForGetWhenAlreadyPaidInFull(pagePath)

      context('when response and CCJ not submitted', () => {

        it('should return 500 and render error page when cannot retrieve claim', async () => {
          claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error')

          await request(app)
            .get(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.serverError.withText('Error'))
        })

        it('should return 500 and render error page when cannot retrieve draft', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId()
          draftStoreServiceMock.rejectFind('Error')

          await request(app)
            .get(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.serverError.withText('Error'))
        })

        it('should render page when everything is fine', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId()
          draftStoreServiceMock.resolveFind('response:full-admission')
          draftStoreServiceMock.resolveFind('mediation')

          await request(app)
            .get(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.successful.withText('List your bank and savings accounts'))
        })
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

      describe('errors are handled properly', () => {

        it('should return 500 and render error page when cannot retrieve claim', async () => {
          claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error')

          await request(app)
            .post(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.serverError.withText('Error'))
        })

        it('should return 500 and render error page when cannot retrieve draft', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId()
          draftStoreServiceMock.rejectFind('Error')

          await request(app)
            .post(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.serverError.withText('Error'))
        })
      })

      describe('save and continue', () => {

        it('should update draft store and redirect', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId()
          draftStoreServiceMock.resolveFind('response:full-admission')
          draftStoreServiceMock.resolveFind('mediation')
          draftStoreServiceMock.resolveUpdate()

          await request(app)
            .post(pagePath)
            .send({ rows: [{ typeOfAccount: BankAccountType.ISA.value, joint: false, balance: 10 }] })
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.redirect
              .toLocation(StatementOfMeansPaths.disabilityPage.evaluateUri(
                { externalId: claimStoreServiceMock.sampleClaimObj.externalId })
              )
            )
        })
      })

      describe('add a new row', () => {

        it('should update draft store and redirect', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId()
          draftStoreServiceMock.resolveFind('response:full-admission')
          draftStoreServiceMock.resolveFind('mediation')

          await request(app)
            .post(pagePath)
            .send({ action: { addRow: 'Add row' } })
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.successful.withText('List your bank and savings accounts'))
        })
      })
    })
  })
})
