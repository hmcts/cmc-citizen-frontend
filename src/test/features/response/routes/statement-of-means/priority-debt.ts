import * as claimStoreServiceMock from 'test/http-mocks/claim-store'
import * as draftStoreServiceMock from 'test/http-mocks/draft-store'
import { StatementOfMeansPaths } from 'response/paths'
import * as request from 'supertest'
import * as config from 'config'
import { app } from 'main/app'
import { attachDefaultHooks } from 'test/routes/hooks'
import { checkAuthorizationGuards } from 'test/routes/authorization-check'
import { checkNotDefendantInCaseGuard } from 'test/common/checks/not-defendant-in-case-check'
import * as idamServiceMock from 'test/http-mocks/idam'
import { checkAlreadySubmittedGuard } from 'test/common/checks/already-submitted-check'
import { checkCountyCourtJudgmentRequestedGuard } from 'test/common/checks/ccj-requested-check'
import { expect } from 'chai'
import { IncomeExpenseSchedule } from 'common/calculate-monthly-income-expense/incomeExpenseSchedule'
import {
  verifyRedirectForGetWhenAlreadyPaidInFull,
  verifyRedirectForPostWhenAlreadyPaidInFull
} from 'test/app/guards/alreadyPaidInFullGuard'

const cookieName: string = config.get<string>('session.cookieName')
const pagePath: string = StatementOfMeansPaths.priorityDebtsPage.evaluateUri(
  { externalId: claimStoreServiceMock.sampleClaimObj.externalId }
)

function checkErrorHandling (method: string) {
  describe('errors should be handled correctly', () => {
    it('should return 500 and render error page when cannot retrieve claim', async () => {
      claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error')

      await request(app)[method](pagePath)
        .set('Cookie', `${cookieName}=ABC`)
        .expect(res => expect(res).to.be.serverError.withText('Error'))
    })

    it('should return 500 and render error page when cannot retrieve draft', async () => {
      claimStoreServiceMock.resolveRetrieveClaimByExternalId()
      draftStoreServiceMock.rejectFind('Error')

      await request(app)[method](pagePath)
        .set('Cookie', `${cookieName}=ABC`)
        .expect(res => expect(res).to.be.serverError.withText('Error'))

    })
  })
}

describe('Defendant response: priority-debt', () => {

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
      checkErrorHandling(method)
      verifyRedirectForGetWhenAlreadyPaidInFull(pagePath)

      it('should render page when everything is fine', async () => {
        claimStoreServiceMock.resolveRetrieveClaimByExternalId()
        draftStoreServiceMock.resolveFind('response:full-admission')
        draftStoreServiceMock.resolveFind('mediation')

        await request(app)
          .get(pagePath)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.successful.withText('Debts you’re behind on'))
      })
    })
  })

  describe('on POST', () => {
    const method = 'post'
    checkAuthorizationGuards(app, method, pagePath)
    checkNotDefendantInCaseGuard(app, method, pagePath)

    context('when user authorised', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor(claimStoreServiceMock.sampleClaimObj.defendantId, 'citizen', 'defendant')
      })

      checkAlreadySubmittedGuard(app, method, pagePath)
      checkCountyCourtJudgmentRequestedGuard(app, method, pagePath)
      checkErrorHandling(method)
      verifyRedirectForPostWhenAlreadyPaidInFull(pagePath)

      describe('validation should be triggered correctly', () => {
        beforeEach(() => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId()
          draftStoreServiceMock.resolveFind('response:full-admission')
          draftStoreServiceMock.resolveFind('mediation')
        })

        it('should trigger validation when negative amount is present', async () => {
          await request(app)
            .post(pagePath)
            .send({
              mortgage: {
                amount: -1,
                schedule: IncomeExpenseSchedule.MONTH.value
              }
            })
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.successful.withText('Enter a valid Mortgage amount, maximum two decimal places'))
        })

        it('should trigger validation when invalid decimal amount is present', async () => {
          await request(app)
            .post(pagePath)
            .send({
              rent: {
                amount: 123.123213,
                schedule: IncomeExpenseSchedule.WEEK.value
              }
            })
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.successful.withText('Enter a valid Rent amount, maximum two decimal places'))
        })

        it('should trigger validation when no amount is present', async () => {
          await request(app)
            .post(pagePath)
            .send({
              gas: {
                schedule: IncomeExpenseSchedule.WEEK.value
              }
            })
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.successful.withText('Enter how much you pay for Gas'))
        })

        it('should trigger validation when no schedule is present', async () => {
          await request(app)
            .post(pagePath)
            .send({
              gas: {
                schedule: IncomeExpenseSchedule.WEEK.value
              }
            })
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.successful.withText('Enter how much you pay for Gas'))
        })
      })

      describe('on save and continue', () => {
        it('should save to the draft store', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId()
          draftStoreServiceMock.resolveFind('response:full-admission')
          draftStoreServiceMock.resolveFind('mediation')
          draftStoreServiceMock.resolveUpdate()

          await request(app)
            .post(pagePath)
            .send({
              mortgage: { amount: 100, schedule: IncomeExpenseSchedule.WEEK.value },
              rent: { amount: 200, schedule: IncomeExpenseSchedule.MONTH.value },
              councilTax: { amount: 100, schedule: IncomeExpenseSchedule.FOUR_WEEKS.value },
              gas: { amount: 200, schedule: IncomeExpenseSchedule.TWO_WEEKS.value },
              electricity: { amount: 100, schedule: IncomeExpenseSchedule.WEEK.value },
              water: { amount: 100, schedule: IncomeExpenseSchedule.MONTH.value },
              maintenance: { amount: 100, schedule: IncomeExpenseSchedule.FOUR_WEEKS.value }
            })
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.redirect.toLocation(
              StatementOfMeansPaths.debtsPage.evaluateUri(
                { externalId: claimStoreServiceMock.sampleClaimObj.externalId }
              ))
            )
        })

      })

      describe('on reset this debt', () => {
        it('should reset the debt', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId()
          draftStoreServiceMock.resolveFind('response:full-admission')
          draftStoreServiceMock.resolveFind('mediation')

          await request(app)
            .post(pagePath)
            .send({
              gas: { amount: '1000', schedule: IncomeExpenseSchedule.WEEK.value },
              action: { resetDebt: { 'gas': 'Reset this debt' } }
            })
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.successful.withText('gas[amount]"'))
            .expect(res => expect(res).to.be.successful.withoutText('1000'))
        })
      })

      describe('on any other action rather reset this debt', () => {
        it('should not reset the debt', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId()
          draftStoreServiceMock.resolveFind('response:full-admission')
          draftStoreServiceMock.resolveFind('mediation')

          await request(app)
            .post(pagePath)
            .send({
              gas: { amount: '1000', schedule: IncomeExpenseSchedule.WEEK.value },
              action: { doNotResetDebt: { 'gas': 'Do not reset this debt' } }
            })
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.successful.withText('gas[amount]"'))
            .expect(res => expect(res).to.be.successful.withText('1000'))
        })
      })
    })

  })
})
