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
import {
  verifyRedirectForGetWhenAlreadyPaidInFull,
  verifyRedirectForPostWhenAlreadyPaidInFull
} from 'test/app/guards/alreadyPaidInFullGuard'

const cookieName: string = config.get<string>('session.cookieName')
const pagePath: string = StatementOfMeansPaths.monthlyExpensesPage.evaluateUri(
  { externalId: claimStoreServiceMock.sampleClaimObj.externalId }
)

describe('Defendant response: Statement of means: monthly-expenses', () => {

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
            .expect(res => expect(res).to.be.successful.withText('What are your regular expenses?'))
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

        it('should trigger validation when negative amount is given', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId()
          draftStoreServiceMock.resolveFind('response:full-admission')
          draftStoreServiceMock.resolveFind('mediation')

          await request(app)
            .post(pagePath)
            .send({
              mortgage: {
                amount: -100,
                schedule: IncomeExpenseSchedule.MONTH.value
              },
              rent: {
                amount: -200,
                schedule: IncomeExpenseSchedule.TWO_WEEKS.value
              }
            })
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.successful.withText('Enter a valid mortgage amount, maximum two decimal places'))
            .expect(res => expect(res).to.be.successful.withText('Enter a valid rent amount, maximum two decimal places'))
        })

        it('should trigger validation when invalid decimal amount is given', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId()
          draftStoreServiceMock.resolveFind('response:full-admission')
          draftStoreServiceMock.resolveFind('mediation')

          await request(app)
            .post(pagePath)
            .send({
              mortgage: {
                amount: 100.123,
                schedule: IncomeExpenseSchedule.MONTH.value
              },
              rent: {
                amount: 200.345,
                schedule: IncomeExpenseSchedule.TWO_WEEKS.value
              }
            })
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.successful.withText('Enter a valid mortgage amount, maximum two decimal places'))
            .expect(res => expect(res).to.be.successful.withText('Enter a valid rent amount, maximum two decimal places'))
        })

        it('should trigger validation when no amount is given', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId()
          draftStoreServiceMock.resolveFind('response:full-admission')
          draftStoreServiceMock.resolveFind('mediation')

          await request(app)
            .post(pagePath)
            .send({
              mortgage: {
                schedule: IncomeExpenseSchedule.MONTH.value
              },
              rent: {
                schedule: IncomeExpenseSchedule.MONTH.value
              }
            })
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.successful.withText('Enter how much you pay for mortgage'))
            .expect(res => expect(res).to.be.successful.withText('Enter how much you pay for rent'))
        })

        it('should trigger validation when no schedule is given', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId()
          draftStoreServiceMock.resolveFind('response:full-admission')
          draftStoreServiceMock.resolveFind('mediation')

          await request(app)
            .post(pagePath)
            .send({
              mortgage: {
                amount: 100
              },
              rent: {
                amount: 700
              }
            })
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.successful.withText('Select how often you pay for mortgage'))
            .expect(res => expect(res).to.be.successful.withText('Select how often you pay for rent'))
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
              mortgage: 1,
              rent: 1,
              councilTax: 1,
              gas: 1,
              electricity: 1,
              water: 1,
              travel: 1,
              schoolCosts: 1,
              foodAndHousekeeping: 1,
              tvAndBroadband: 1,
              phone: 1,
              maintenance: 1,
              rows: [{ amount: 10, description: 'bla bla bla' }]
            })
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.redirect
              .toLocation(StatementOfMeansPaths.monthlyIncomePage.evaluateUri(
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
              other: [
                {
                  name: '',
                  amount: ''
                },
                {
                  name: '',
                  amount: ''
                }],
              action: { addOther: 'Add another expense' }
            })
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.successful.withText('other[2][name]'))
            .expect(res => expect(res).to.be.successful.withoutText('other[3][name]'))
        })

        it('should remove row', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId()
          draftStoreServiceMock.resolveFind('response:full-admission')
          draftStoreServiceMock.resolveFind('mediation')

          await request(app)
            .post(pagePath)
            .send({
              other: [
                {
                  name: '',
                  amount: ''
                },
                {
                  name: '',
                  amount: ''
                }],
              action: { removeOther: 'Remove this expense source' }
            })
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.successful.withText('other[0][name]'))
            .expect(res => expect(res).to.be.successful.withoutText('other[1][name]'))
        })

        it('should remove row', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId()
          draftStoreServiceMock.resolveFind('response:full-admission')
          draftStoreServiceMock.resolveFind('mediation')

          await request(app)
            .post(pagePath)
            .send({
              other: [
                {
                  name: 'abcdefghijkl',
                  amount: '1234'
                }],
              action: {
                reset: {
                  'other.0': 'Reset this expense source'
                }
              }
            })
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.successful.withText('other[0][name]'))
            .expect(res => expect(res).to.be.successful.withoutText('abcdefghijkl'))
        })
      })
    })
  })
})
