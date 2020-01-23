/* tslint:disable:no-unused-expression */
import { expect } from 'chai'

import { FullAdmission, PartialAdmission, ResponseDraft } from 'response/draft/responseDraft'
import { MomentFactory } from 'shared/momentFactory'
import { PaymentPlan } from 'shared/components/payment-intention/model/paymentPlan'
import { PaymentSchedule } from 'ccj/form/models/paymentSchedule'
import { localDateFrom } from 'test/localDateUtils'
import { YourRepaymentPlanTask } from 'features/response/tasks/yourRepaymentPlanTask'
import { LocalDate } from 'forms/models/localDate'

describe('YourRepaymentPlanTask', () => {

  [{ type: 'fullAdmission', clazz: FullAdmission }, { type: 'partialAdmission', clazz: PartialAdmission }]
    .forEach(admission => {
      describe(`for ${admission.type}`, () => {
        context('should not be completed', () => {

          it('when payment plan is undefined', () => {
            const draft: ResponseDraft = new ResponseDraft()
            draft[admission.type] = new admission.clazz()
            draft[admission.type].paymentPlan = undefined

            expect(YourRepaymentPlanTask.isCompleted(draft[admission.type].paymentPlan)).to.be.false
          })

          it('when payment plan is invalid', () => {
            const draft: ResponseDraft = new ResponseDraft()
            draft[admission.type] = new admission.clazz()
            draft[admission.type].paymentPlan = new PaymentPlan(
              undefined,
              undefined,
              undefined,
              undefined
            )

            expect(YourRepaymentPlanTask.isCompleted(draft[admission.type].paymentPlan)).to.be.false
          })

          it('when payment plan has first payment date in the past', () => {
            const draft: ResponseDraft = new ResponseDraft()
            draft[admission.type] = new admission.clazz()
            draft[admission.type].paymentPlan = new PaymentPlan(
              100,
              10,
              LocalDate.fromMoment(MomentFactory.currentDate().subtract(1,'day')),
              PaymentSchedule.EVERY_MONTH
            )

            expect(YourRepaymentPlanTask.isCompleted(draft[admission.type].paymentPlan)).to.be.false
          })
        })

        context('should be completed', () => {
          it('when payment plan is valid', () => {
            const draft: ResponseDraft = new ResponseDraft()
            draft[admission.type] = new admission.clazz()
            draft[admission.type].paymentPlan = new PaymentPlan(
              1000,
              100,
              localDateFrom(MomentFactory.currentDate().add(1, 'day')),
              PaymentSchedule.EACH_WEEK
            )

            expect(YourRepaymentPlanTask.isCompleted(draft[admission.type].paymentPlan)).to.be.true
          })
        })
      })
    })
})
