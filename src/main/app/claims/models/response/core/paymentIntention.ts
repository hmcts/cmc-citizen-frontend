import { Moment } from 'moment'

import { PaymentOption } from 'claims/models/response/core/paymentOption'
import { RepaymentPlan } from 'claims/models/response/core/repaymentPlan'
import { MomentFactory } from 'shared/momentFactory'

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
      paymentSchedule: input.repaymentPlan.paymentSchedule
    }

    return instance
  }

  get isPastPaymentDeadline (): boolean {
    const currentDateSetTo4PM = MomentFactory.currentDate().hour(15)
    return this.paymentDate && currentDateSetTo4PM > this.paymentDate
  }
}
