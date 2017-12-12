import { Moment } from 'moment'
import { PaymentSchedule } from 'ccj/form/models/paymentSchedule'
import { MomentFactory } from 'common/momentFactory'

export class RepaymentPlan {

  constructor (public firstPayment?: number,
               public instalmentAmount?: number,
               public firstPaymentDate?: Moment,
               public paymentSchedule?: string | PaymentSchedule) {
    this.firstPayment = firstPayment
    this.instalmentAmount = instalmentAmount
    this.firstPaymentDate = firstPaymentDate
    this.paymentSchedule = paymentSchedule
  }

  deserialize (input?: any): RepaymentPlan {
    if (input) {
      this.firstPayment = input.firstPayment
      this.instalmentAmount = input.instalmentAmount
      this.firstPaymentDate = MomentFactory.parse(input.firstPaymentDate)
      this.paymentSchedule = PaymentSchedule.of(input.paymentSchedule)
    }

    return this
  }
}
