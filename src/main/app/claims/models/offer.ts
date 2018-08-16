import { Moment } from 'moment'
import { MomentFactory } from 'shared/momentFactory'
import { PaymentIntention } from 'claims/models/response/core/paymentIntention'

export class Offer {
  content: string
  completionDate: Moment
  paymentIntention?: PaymentIntention

  constructor (content?: string, completionDate?: Moment, paymentIntention?: PaymentIntention) {
    this.content = content
    this.completionDate = completionDate
    this.paymentIntention = paymentIntention
  }

  deserialize (input: any): Offer {
    if (input) {
      this.content = input.content
      this.completionDate = MomentFactory.parse(input.completionDate)
      this.paymentIntention = PaymentIntention.deserialize(input.paymentIntention)
    }
    return this
  }
}
