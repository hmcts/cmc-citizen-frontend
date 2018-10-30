import { attachDefaultHooks } from 'test/routes/hooks'
import * as idamServiceMock from 'test/http-mocks/idam'
import 'test/routes/expectations'

import * as claimStoreServiceMock from 'test/http-mocks/claim-store'
import * as request from 'supertest'
import { app } from 'main/app'
import { Paths } from 'ccj/paths'
import { Paths as DashboardPaths } from 'dashboard/paths'
import * as config from 'config'
import { expect } from 'chai'
import { MomentFactory } from 'shared/momentFactory'
import { RoutablePath } from 'shared/router/routablePath'
import { CountyCourtJudgmentType } from 'claims/models/countyCourtJudgmentType'

const cookieName: string = config.get<string>('session.cookieName')

describe('CCJ guard', () => {
  attachDefaultHooks(app)
  describe('on GET', () => {
    context('when user authorised', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor('1', 'citizen')
      })

      context('should redirect to dashboard when claim not eligible for CCJ', () => {
        const excludedPaths = [Paths.confirmationPage, Paths.redeterminationPage, Paths.repaymentPlanSummaryPage]
        Object.values(Paths)
          .filter(path => !excludedPaths.includes(path))
          .forEach((path: RoutablePath) => {
            const route: string = path.evaluateUri({ externalId: 'b17af4d2-273f-4999-9895-bce382fa24c8' })

            it(`for ${route} route`, async () => {
              claimStoreServiceMock.resolveRetrieveClaimByExternalId({ respondedAt: MomentFactory.currentDateTime() })

              await request(app)
                .get(route)
                .set('Cookie', `${cookieName}=ABC`)
                .expect(res => expect(res).to.be.redirect.toLocation(DashboardPaths.dashboardPage.uri))
            })
          })
      })

      it('should NOT redirect to dashboard when claim not eligible for CCJ on confirmation page', async () => {
        const route: string = Paths.confirmationPage.evaluateUri({ externalId: 'b17af4d2-273f-4999-9895-bce382fa24c8' })
        claimStoreServiceMock.resolveRetrieveClaimByExternalId({
          respondedAt: MomentFactory.currentDateTime(),
          countyCourtJudgmentRequestedAt: '2017-10-10T22:45:51.785'
        })

        await request(app)
          .get(route)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.successful.withText('County Court Judgment requested'))
      })

      it('should NOT redirect to dashboard when claim not eligible for CCJ on re determination page', async () => {
        const route: string = Paths.redeterminationPage.evaluateUri({ externalId: 'b17af4d2-273f-4999-9895-bce382fa24c8' })
        claimStoreServiceMock.resolveRetrieveClaimByExternalId({
          respondedAt: MomentFactory.currentDateTime(),
          countyCourtJudgmentRequestedAt: '2017-10-10T22:45:51.785',
          countyCourtJudgment: {
            defendantDateOfBirth: '1990-11-01',
            paidAmount: 2,
            paymentOption: 'INSTALMENTS',
            repaymentPlan: {
              instalmentAmount: 30,
              firstPaymentDate: '2018-11-11',
              paymentSchedule: 'EVERY_MONTH',
              completionDate: '2019-11-11',
              paymentLength: '12 months'
            },
            ccjType: CountyCourtJudgmentType.DETERMINATION
          }
        })

        await request(app)
          .get(route)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.successful.withText('Why do you believe the defendant can repay you sooner'))
      })

      it('should NOT redirect to dashboard when claim not eligible for CCJ on repayment plan summary page', async () => {
        const route: string = Paths.repaymentPlanSummaryPage.evaluateUri({ externalId: 'b17af4d2-273f-4999-9895-bce382fa24c8' })
        claimStoreServiceMock.resolveRetrieveClaimByExternalId({
          respondedAt: MomentFactory.currentDateTime(),
          countyCourtJudgmentRequestedAt: '2017-10-10T22:45:51.785',
          countyCourtJudgment: {
            defendantDateOfBirth: '1990-11-01',
            paidAmount: 2,
            paymentOption: 'INSTALMENTS',
            repaymentPlan: {
              instalmentAmount: 30,
              firstPaymentDate: '2018-11-11',
              paymentSchedule: 'EVERY_MONTH',
              completionDate: '2019-11-11',
              paymentLength: '12 months'
            },
            ccjType: CountyCourtJudgmentType.DETERMINATION
          }
        })

        await request(app)
          .get(route)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.successful.withText('The repayment plan'))
      })
    })
  })
})
