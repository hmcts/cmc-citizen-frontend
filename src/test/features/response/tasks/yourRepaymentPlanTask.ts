/* tslint:disable:no-unused-expression */
import { expect } from 'chai'

import { FullAdmission, ResponseDraft } from 'response/draft/responseDraft'
import { DefendantPaymentOption, DefendantPaymentType } from 'response/form/models/defendantPaymentOption'
import { MomentFactory } from 'shared/momentFactory'
import { DefendantPaymentPlan as PaymentPlan } from 'response/form/models/defendantPaymentPlan'
import { PaymentSchedule } from 'ccj/form/models/paymentSchedule'
import { localDateFrom } from 'test/localDateUtils'
import { ResponseType } from 'response/form/models/responseType'
import { Response } from 'response/form/models/response'
import { YourRepaymentPlanTask } from 'features/response/tasks/yourRepaymentPlanTask'
import { PaymentType } from 'features/ccj/form/models/ccjPaymentOption'

function validResponseDraftWith (paymentType: DefendantPaymentType): ResponseDraft {
  const responseDraft: ResponseDraft = new ResponseDraft()
  responseDraft.response = new Response(ResponseType.FULL_ADMISSION)
  responseDraft.fullAdmission = new FullAdmission()
  responseDraft.fullAdmission.paymentOption = new DefendantPaymentOption(paymentType)
  responseDraft.fullAdmission.paymentPlan = new PaymentPlan(
    1000,
    100,
    localDateFrom(MomentFactory.currentDate().add(1, 'day')),
    PaymentSchedule.EACH_WEEK
  )
  return responseDraft
}

describe('YourRepaymentPlanTask', () => {

  context('when payment plan object is undefined', () => {

    it('should not be completed', () => {
      const draft: ResponseDraft = new ResponseDraft()
      draft.fullAdmission = new FullAdmission()
      draft.fullAdmission.paymentPlan = undefined

      expect(YourRepaymentPlanTask.isCompleted(draft)).to.be.false
    })
  })

  context('when payment plan object is valid', () => {

    it('should be completed', () => {
      const draft: ResponseDraft = new ResponseDraft()
      draft.fullAdmission = new FullAdmission()
      draft.fullAdmission.paymentPlan = validResponseDraftWith(PaymentType.INSTALMENTS)

      expect(YourRepaymentPlanTask.isCompleted(draft)).to.be.true
    })
  })

  context('when payment plan object is invalid', () => {

    it('should not be completed', () => {
      const draft: ResponseDraft = new ResponseDraft()
      draft.fullAdmission = new FullAdmission()
      draft.fullAdmission.paymentPlan = new PaymentPlan(
        1000,
        100,
        localDateFrom(MomentFactory.currentDate().subtract(100, 'day')),
        PaymentSchedule.EACH_WEEK
      )

      expect(YourRepaymentPlanTask.isCompleted(draft)).to.be.false
    })
  })
})
