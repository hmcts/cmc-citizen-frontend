import { Serializable } from 'app/models/serializable'
import ClaimAmountBreakdown from 'app/forms/models/claimAmountBreakdown'
import InterestDate from 'app/claims/models/interestDate'
import Interest from 'app/forms/models/interest'
import { Claimant } from 'claims/models/claimant'
import { Defendant } from 'claims/models/defendant'

export default class ClaimData implements Serializable<ClaimData> {
  claimant: Claimant
  defendant: Defendant
  paidFeeAmount: number
  amount: number
  reason: string
  interest: Interest
  interestDate: InterestDate

  deserialize (input: any): ClaimData {
    if (input) {
      this.claimant = new Claimant().deserialize(input.claimant)
      this.defendant = new Defendant().deserialize(input.defendant)
      this.paidFeeAmount = this.claimant.payment.amount / 100
      this.amount = new ClaimAmountBreakdown().deserialize(input.amount).totalAmount()
      this.reason = input.reason
      this.interest = new Interest().deserialize(input.interest)
      this.interestDate = new InterestDate().deserialize(input.interestDate)
    }
    return this
  }
}
