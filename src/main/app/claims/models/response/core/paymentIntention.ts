import { Moment } from 'moment'

import { PaymentOption } from 'claims/models/paymentOption'
import { RepaymentPlan as CoreRepaymentPlan, RepaymentPlan } from 'claims/models/response/core/repaymentPlan'
import { MomentFactory } from 'shared/momentFactory'
import { Claim } from 'claims/models/claim'
import { PaymentSchedule } from 'ccj/form/models/paymentSchedule'

export class PaymentIntention {
  paymentOption?: PaymentOption
  paymentDate?: Moment
  repaymentPlan?: RepaymentPlan

  static deserialize (input: any): PaymentIntention {
    if (!input) {
      return input
    }

    const instance = new PaymentIntention()
    instance.paymentOption = input.paymentOption
    instance.paymentDate = input.paymentDate && MomentFactory.parse(input.paymentDate)
    instance.repaymentPlan = input.repaymentPlan && {
      instalmentAmount: input.repaymentPlan.instalmentAmount,
      firstPaymentDate: MomentFactory.parse(input.repaymentPlan.firstPaymentDate),
      paymentSchedule: input.repaymentPlan.paymentSchedule,
      completionDate: input.repaymentPlan.completionDate && MomentFactory.parse(input.repaymentPlan.completionDate),
      paymentLength: input.repaymentPlan.paymentLength
    }

    return instance
  }

  static retrievePaymentIntention (ccjRepaymentPlan, claim: Claim): PaymentIntention {
    return {
      repaymentPlan: ccjRepaymentPlan && {
        instalmentAmount: ccjRepaymentPlan.instalmentAmount,
        firstPaymentDate: ccjRepaymentPlan.firstPaymentDate,
        paymentSchedule: (ccjRepaymentPlan.paymentSchedule as PaymentSchedule).value,
        completionDate: ccjRepaymentPlan.completionDate,
        paymentLength: ccjRepaymentPlan.paymentLength
      } as CoreRepaymentPlan,
      paymentDate: claim.countyCourtJudgment.payBySetDate,
      paymentOption: claim.countyCourtJudgment.paymentOption
    } as PaymentIntention
  }
}
