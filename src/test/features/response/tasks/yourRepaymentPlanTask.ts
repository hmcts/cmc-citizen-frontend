/* tslint:disable:no-unused-expression */
import { expect } from 'chai'

import { FullAdmission, ResponseDraft } from 'response/draft/responseDraft'
import { MomentFactory } from 'shared/momentFactory'
import { DefendantPaymentPlan as PaymentPlan } from 'response/form/models/defendantPaymentPlan'
import { PaymentSchedule } from 'ccj/form/models/paymentSchedule'
import { localDateFrom } from 'test/localDateUtils'
import { YourRepaymentPlanTask } from 'features/response/tasks/yourRepaymentPlanTask'

describe('YourRepaymentPlanTask', () => {

  context('should not be completed', () => {
    it('when payment plan is undefined', () => {
      const draft: ResponseDraft = new ResponseDraft()
      draft.fullAdmission = new FullAdmission()
      draft.fullAdmission.paymentPlan = undefined

      expect(YourRepaymentPlanTask.isCompleted(draft)).to.be.false
    })

    it('when payment plan is invalid', () => {
      const draft: ResponseDraft = new ResponseDraft()
      draft.fullAdmission = new FullAdmission()
      draft.fullAdmission.paymentPlan = new PaymentPlan(
        undefined,
        undefined,
        undefined,
        undefined
      )

      expect(YourRepaymentPlanTask.isCompleted(draft)).to.be.false
    })
  })

  context('should be completed', () => {
    it('when payment plan is valid', () => {
      const draft: ResponseDraft = new ResponseDraft()
      draft.fullAdmission = new FullAdmission()
      draft.fullAdmission.paymentPlan = new PaymentPlan(
        1000,
        100,
        localDateFrom(MomentFactory.currentDate().add(1, 'day')),
        PaymentSchedule.EACH_WEEK
      )

      expect(YourRepaymentPlanTask.isCompleted(draft)).to.be.true
    })
  })
})
