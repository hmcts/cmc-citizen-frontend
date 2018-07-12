import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'
import 'test/routes/expectations'
import { StatementOfMeansPaths } from 'response/paths'
import * as idamServiceMock from 'test/http-mocks/idam'
import * as draftStoreServiceMock from 'test/http-mocks/draft-store'
import * as claimStoreServiceMock from 'test/http-mocks/claim-store'
import { attachDefaultHooks } from 'test/routes/hooks'
import { checkAuthorizationGuards } from 'test/features/response/routes/checks/authorization-check'
import { checkAlreadySubmittedGuard } from 'test/features/response/routes/checks/already-submitted-check'
import { checkCountyCourtJudgmentRequestedGuard } from 'test/features/response/routes/checks/ccj-requested-check'
import { app } from 'main/app'
import { checkNotDefendantInCaseGuard } from 'test/features/response/routes/checks/not-defendant-in-case-check'
import { ExpenseSchedule } from 'response/form/models/statement-of-means/expenseSchedule'

const cookieName: string = config.get<string>('session.cookieName')
const pagePath: string = StatementOfMeansPaths.monthlyIncomePage.evaluateUri(
  { externalId: claimStoreServiceMock.sampleClaimObj.externalId }
)

describe('Defendant response: Statement of means: monthly-income', () => {

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

          await request(app)
            .get(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.successful.withText('What regular income do you receive?'))
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

        it('should trigger validation when negative amount is given', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId()
          draftStoreServiceMock.resolveFind('response:full-admission')

          await request(app)
            .post(pagePath)
            .send({
              salarySource: {
                amount: -100,
                schedule: ExpenseSchedule.MONTH.value
              },
              pensionSource: {
                amount: -200,
                schedule: ExpenseSchedule.TWO_WEEKS.value
              }})
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.successful.withText('Enter a valid Income from your job amount, maximum two decimal places'))
            .expect(res => expect(res).to.be.successful.withText('Enter a valid Pension (paid to you) amount, maximum two decimal places'))
        })

        it('should trigger validation when invalid decimal amount is given', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId()
          draftStoreServiceMock.resolveFind('response:full-admission')

          await request(app)
            .post(pagePath)
            .send({
              salarySource: {
                amount: 100.123,
                schedule: ExpenseSchedule.MONTH.value
              },
              jobseekerAllowanceIncomeSource: {
                amount: 200.345,
                schedule: ExpenseSchedule.TWO_WEEKS.value
              } })
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.successful.withText('Enter a valid Income from your job amount, maximum two decimal places'))
            .expect(res => expect(res).to.be.successful.withText('Enter a valid Jobseeker’s Allowance (income based) amount, maximum two decimal places'))
        })

        it('should trigger validation when no amount is given', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId()
          draftStoreServiceMock.resolveFind('response:full-admission')

          await request(app)
            .post(pagePath)
            .send({
              salarySource: {
                schedule: ExpenseSchedule.MONTH.value
              },
              incomeSupportSource: {
                schedule: ExpenseSchedule.MONTH.value
              } })
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.successful.withText('Enter how much Income from your job you receive'))
            .expect(res => expect(res).to.be.successful.withText('Enter how much Income Support you receive'))
        })

        it('should trigger validation when no schedule is given', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId()
          draftStoreServiceMock.resolveFind('response:full-admission')

          await request(app)
            .post(pagePath)
            .send({
              salarySource: {
                amount: 100
              },
              childTaxCreditSource: {
                amount: 700
              } })
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.successful.withText('Select how often you receive Income from your job'))
            .expect(res => expect(res).to.be.successful.withText('Select how often you receive Child Tax Credit'))
        })
      })

      describe('save and continue', () => {

        it('should update draft store and redirect', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId()
          draftStoreServiceMock.resolveFind('response:full-admission')
          draftStoreServiceMock.resolveSave()

          await request(app)
            .post(pagePath)
            .send({
              salarySource: {
                amount: 100,
                schedule: ExpenseSchedule.MONTH.value
              },
              universalCreditSource: {
                amount: 200,
                schedule: ExpenseSchedule.MONTH.value
              },
              jobseekerAllowanceIncomeSource: {
                amount: 300,
                schedule: ExpenseSchedule.TWO_WEEKS.value
              },
              jobseekerAllowanceContributionSource: {
                amount: 400,
                schedule: ExpenseSchedule.MONTH.value
              },
              incomeSupportSource: {
                amount: 500,
                schedule: ExpenseSchedule.MONTH.value
              },
              workingTaxCreditSource: {
                amount: 600,
                schedule: ExpenseSchedule.TWO_WEEKS.value
              },
              childTaxCreditSource: {
                amount: 700,
                schedule: ExpenseSchedule.MONTH.value
              },
              childBenefitSource: {
                amount: 800,
                schedule: ExpenseSchedule.MONTH.value
              },
              councilTaxSupportSource: {
                amount: 900,
                schedule: ExpenseSchedule.TWO_WEEKS.value
              },
              pensionSource: {
                amount: 100,
                schedule: ExpenseSchedule.TWO_WEEKS.value
              } })
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.redirect
              .toLocation(StatementOfMeansPaths.monthlyExpensesPage.evaluateUri(
                { externalId: claimStoreServiceMock.sampleClaimObj.externalId })
              )
            )
        })
      })

      // describe('add a new row', () => {
      //
      //   it('should update draft store and redirect', async () => {
      //     claimStoreServiceMock.resolveRetrieveClaimByExternalId()
      //     draftStoreServiceMock.resolveFind('response:full-admission')
      //
      //     await request(app)
      //       .post(pagePath)
      //       .send({ action: { addRow: 'Add row' } })
      //       .set('Cookie', `${cookieName}=ABC`)
      //       .expect(res => expect(res).to.be.successful.withText('What regular income do you receive?'))
      //   })
      // })
    })
  })
})
