import { Serializable } from 'models/serializable'
import { CountyCourtJudgment } from 'claims/models/countyCourtJudgment'
import { TheirDetails } from 'claims/models/details/theirs/theirDetails'
import { RepaymentPlan } from 'claims/models/replaymentPlan'
import { PaymentType } from 'ccj/form/models/ccjPaymentOption'

export class CountyCourtJudgmentPaidByInstalments extends CountyCourtJudgment
  implements Serializable<CountyCourtJudgmentPaidByInstalments> {

  constructor (public defendant?: TheirDetails,
               public paidAmount?: number,
               public repaymentPlan?: RepaymentPlan) {
    super(defendant, PaymentType.INSTALMENTS.value, paidAmount)
    this.repaymentPlan = repaymentPlan
  }

  deserialize (input: any): CountyCourtJudgmentPaidByInstalments {
    if (input) {
      this.defendant = new TheirDetails().deserialize(input.defendant)
      this.paidAmount = input.paidAmount
      this.paymentOption = input.paymentOption
      this.repaymentPlan = new RepaymentPlan().deserialize(input.repaymentPlan)
    }

    return this
  }
}
