import { Serializable } from 'models/serializable'
import { CountyCourtJudgment } from 'claims/models/countyCourtJudgment'
import { PaymentType } from 'ccj/form/models/ccjPaymentOption'
import { TheirDetails } from 'claims/models/details/theirs/theirDetails'

export class CountyCourtJudgmentImmediatePayment extends CountyCourtJudgment
  implements Serializable<CountyCourtJudgmentImmediatePayment> {

  constructor (public defendant?: TheirDetails,
               public paidAmount?: number) {
    super(defendant, PaymentType.IMMEDIATELY.value, paidAmount)
  }

  deserialize (input: any): CountyCourtJudgmentImmediatePayment {
    if (input) {
      this.defendant = new TheirDetails().deserialize(input.defendant)
      this.paymentOption = input.paymentOption
      this.paidAmount = input.paidAmount
    }

    return this
  }
}
