import { Moment } from 'moment'

import { PaymentOption } from 'claims/models/response/core/paymentOption'
import { RepaymentPlan } from 'claims/models/response/core/repaymentPlan'
import { MomentFactory } from 'shared/momentFactory'

export interface PaymentIntention {
  paymentOption?: PaymentOption
  paymentDate?: Moment
  repaymentPlan?: RepaymentPlan
}

export namespace PaymentIntention {
  export function deserialize (input: any): PaymentIntention {
    return input && {
      paymentOption: input.paymentOption as PaymentOption,
      paymentDate: input.paymentDate && MomentFactory.parse(input.paymentDate),
      repaymentPlan: input.repaymentPlan && {
        instalmentAmount: input.repaymentPlan.instalmentAmount,
        firstPaymentDate: MomentFactory.parse(input.repaymentPlan.firstPaymentDate),
        paymentSchedule: input.repaymentPlan.paymentSchedule
      }
    }
  }
}
