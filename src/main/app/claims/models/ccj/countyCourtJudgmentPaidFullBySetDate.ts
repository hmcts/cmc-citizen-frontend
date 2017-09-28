import { Serializable } from 'models/serializable'
import { CountyCourtJudgment } from 'claims/models/countyCourtJudgment'
import { TheirDetails } from 'claims/models/details/theirs/theirDetails'
import { PaymentType } from 'ccj/form/models/ccjPaymentOption'
import { Moment } from 'moment'
import { MomentFactory } from 'common/momentFactory'

export class CountyCourtJudgmentPaidFullBySetDate extends CountyCourtJudgment
  implements Serializable<CountyCourtJudgmentPaidFullBySetDate> {

  constructor (public defendant?: TheirDetails,
               public paidAmount?: number,
               public payBySetDate?: string | Moment) {
    super(defendant, PaymentType.FULL_BY_SPECIFIED_DATE.value, paidAmount)
    this.payBySetDate = payBySetDate
  }

  deserialize (input: any): CountyCourtJudgmentPaidFullBySetDate {
    if (input) {
      this.defendant = new TheirDetails().deserialize(input.defendant)
      this.paidAmount = input.paidAmount
      this.paymentOption = input.paymentOption
      this.payBySetDate = MomentFactory.parse(input.payBySetDate)
    }

    return this
  }
}
