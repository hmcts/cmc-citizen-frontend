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
import { IncomeExpenseSchedule } from 'response/form/models/statement-of-means/incomeExpenseSchedule'

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
          draftStoreServiceMock.resolveFind('mediation')

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
          draftStoreServiceMock.resolveFind('mediation')

          await request(app)
            .post(pagePath)
            .send({
              salarySource: {
                amount: -100,
                schedule: IncomeExpenseSchedule.MONTH.value
              },
              pensionSource: {
                amount: -200,
                schedule: IncomeExpenseSchedule.TWO_WEEKS.value
              }})
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.successful.withText('Enter a valid income from your job amount, maximum two decimal places'))
            .expect(res => expect(res).to.be.successful.withText('Enter a valid pension amount, maximum two decimal places'))
        })

        it('should trigger validation when invalid decimal amount is given', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId()
          draftStoreServiceMock.resolveFind('response:full-admission')
          draftStoreServiceMock.resolveFind('mediation')

          await request(app)
            .post(pagePath)
            .send({
              salarySource: {
                amount: 100.123,
                schedule: IncomeExpenseSchedule.MONTH.value
              },
              jobseekerAllowanceIncomeSource: {
                amount: 200.345,
                schedule: IncomeExpenseSchedule.TWO_WEEKS.value
              } })
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.successful.withText('Enter a valid income from your job amount, maximum two decimal places'))
            .expect(res => expect(res).to.be.successful.withText('Enter a valid Jobseeker’s Allowance (income based) amount, maximum two decimal places'))
        })

        it('should trigger validation when no amount is given', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId()
          draftStoreServiceMock.resolveFind('response:full-admission')
          draftStoreServiceMock.resolveFind('mediation')

          await request(app)
            .post(pagePath)
            .send({
              salarySource: {
                schedule: IncomeExpenseSchedule.MONTH.value
              },
              incomeSupportSource: {
                schedule: IncomeExpenseSchedule.MONTH.value
              } })
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.successful.withText('Enter how much income from your job you receive'))
            .expect(res => expect(res).to.be.successful.withText('Enter how much Income Support you receive'))
        })

        it('should trigger validation when no schedule is given', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId()
          draftStoreServiceMock.resolveFind('response:full-admission')
          draftStoreServiceMock.resolveFind('mediation')

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
            .expect(res => expect(res).to.be.successful.withText('Select how often you receive income from your job'))
            .expect(res => expect(res).to.be.successful.withText('Select how often you receive Child Tax Credit'))
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
            .send({
              salarySource: {
                amount: 100,
                schedule: IncomeExpenseSchedule.MONTH.value
              },
              universalCreditSource: {
                amount: 200,
                schedule: IncomeExpenseSchedule.MONTH.value
              },
              jobseekerAllowanceIncomeSource: {
                amount: 300,
                schedule: IncomeExpenseSchedule.TWO_WEEKS.value
              },
              jobseekerAllowanceContributionSource: {
                amount: 400,
                schedule: IncomeExpenseSchedule.MONTH.value
              },
              incomeSupportSource: {
                amount: 500,
                schedule: IncomeExpenseSchedule.MONTH.value
              },
              workingTaxCreditSource: {
                amount: 600,
                schedule: IncomeExpenseSchedule.TWO_WEEKS.value
              },
              childTaxCreditSource: {
                amount: 700,
                schedule: IncomeExpenseSchedule.MONTH.value
              },
              childBenefitSource: {
                amount: 800,
                schedule: IncomeExpenseSchedule.MONTH.value
              },
              councilTaxSupportSource: {
                amount: 900,
                schedule: IncomeExpenseSchedule.TWO_WEEKS.value
              },
              pensionSource: {
                amount: 100,
                schedule: IncomeExpenseSchedule.TWO_WEEKS.value
              } })
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.redirect
              .toLocation(StatementOfMeansPaths.explanationPage.evaluateUri(
                { externalId: claimStoreServiceMock.sampleClaimObj.externalId })
              )
            )
        })
      })

      describe('other actions', () => {
        it('should add new row', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId()
          draftStoreServiceMock.resolveFind('response:full-admission')
          draftStoreServiceMock.resolveFind('mediation')

          await request(app)
            .post(pagePath)
            .send({
              otherSources: [
                {
                  name: '',
                  amount: ''
                },
                {
                  name: '',
                  amount: ''
                }],
              action: { addOtherIncomeSource: 'Add another income' }
            })
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.successful.withText('otherSources[2][name]'))
            .expect(res => expect(res).to.be.successful.withoutText('otherSources[3][name]'))
        })

        it('should remove row', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId()
          draftStoreServiceMock.resolveFind('response:full-admission')
          draftStoreServiceMock.resolveFind('mediation')

          await request(app)
            .post(pagePath)
            .send({
              otherSources: [
                {
                  name: '',
                  amount: ''
                },
                {
                  name: '',
                  amount: ''
                }],
              action: { removeOtherIncomeSource: 'Remove this income source' }
            })
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.successful.withText('otherSources[0][name]'))
            .expect(res => expect(res).to.be.successful.withoutText('otherSources[1][name]'))
        })

        it('should reset row', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId()
          draftStoreServiceMock.resolveFind('response:full-admission')
          draftStoreServiceMock.resolveFind('mediation')

          await request(app)
            .post(pagePath)
            .send({
              otherSources: [
                {
                  name: 'abcdefghijkl',
                  amount: '1234'
                }],
              action: {
                resetIncomeSource: {
                  'otherSources.0': 'Reset this income source'
                }
              }
            })
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.successful.withText('otherSources[0][name]'))
            .expect(res => expect(res).to.be.successful.withoutText('abcdefghijkl'))
        })
      })
    })
  })
})
