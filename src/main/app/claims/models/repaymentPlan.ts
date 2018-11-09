import { Moment } from 'moment'
import { PaymentSchedule } from 'ccj/form/models/paymentSchedule'
import { MomentFactory } from 'shared/momentFactory'

export class RepaymentPlan {

  constructor (public instalmentAmount?: number,
               public firstPaymentDate?: Moment,
               public paymentSchedule?: string | PaymentSchedule,
               public completionDate?: Moment,
               public paymentLength?: string) {
    this.instalmentAmount = instalmentAmount
    this.firstPaymentDate = firstPaymentDate
    this.paymentSchedule = paymentSchedule
    this.completionDate = completionDate
    this.paymentLength = paymentLength
  }

  deserialize (input?: any): RepaymentPlan {
    if (input) {
      this.instalmentAmount = input.instalmentAmount
      this.firstPaymentDate = MomentFactory.parse(input.firstPaymentDate)
      this.paymentSchedule = PaymentSchedule.of(input.paymentSchedule)
      if (input.completionDate) {
        this.completionDate = MomentFactory.parse(input.completionDate)
      }
      this.paymentLength = input.paymentLength
    }

    return this
  }
}
