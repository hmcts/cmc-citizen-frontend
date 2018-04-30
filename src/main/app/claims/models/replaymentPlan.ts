import { Moment } from 'moment'
import { PaymentSchedule } from 'ccj/form/models/paymentSchedule'
import { MomentFactory } from 'common/momentFactory'

export class RepaymentPlan {

  constructor (public instalmentAmount?: number,
               public firstPaymentDate?: Moment,
               public paymentSchedule?: string | PaymentSchedule) {
    this.instalmentAmount = instalmentAmount
    this.firstPaymentDate = firstPaymentDate
    this.paymentSchedule = paymentSchedule
  }

  deserialize (input?: any): RepaymentPlan {
    if (input) {
      this.instalmentAmount = input.instalmentAmount
      this.firstPaymentDate = MomentFactory.parse(input.firstPaymentDate)
      this.paymentSchedule = PaymentSchedule.of(input.paymentSchedule)
    }

    return this
  }
}
