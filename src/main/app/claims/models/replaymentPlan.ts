import { Moment } from 'moment'
import { PaymentSchedule } from 'ccj/form/models/paymentSchedule'
import { MomentFactory } from 'common/momentFactory'
import { Serializable } from 'models/serializable'

export class RepaymentPlan implements Serializable<RepaymentPlan> {

  constructor (public remainingAmount?: number,
               public firstPayment?: number,
               public instalmentAmount?: number,
               public firstPaymentDate?: string | Moment,
               public paymentSchedule?: string | PaymentSchedule) {
    this.remainingAmount = remainingAmount
    this.firstPayment = firstPayment
    this.instalmentAmount = instalmentAmount
    this.firstPaymentDate = firstPaymentDate
    this.paymentSchedule = paymentSchedule
  }

  deserialize (input?: any): RepaymentPlan {
    if (input) {
      this.remainingAmount = input.remainingAmount
      this.firstPayment = input.firstPayment
      this.instalmentAmount = input.instalmentAmount
      this.firstPaymentDate = MomentFactory.parse(input.firstPaymentDate)
      this.paymentSchedule = PaymentSchedule.of(input.paymentSchedule)
    }

    return this
  }

}
