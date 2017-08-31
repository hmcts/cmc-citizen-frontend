import { Serializable } from 'app/models/serializable'
import ClaimAmountBreakdown from 'app/forms/models/claimAmountBreakdown'
import InterestDate from 'app/claims/models/interestDate'
import Interest from 'app/forms/models/interest'
import { Claimant } from 'claims/models/claimant'
import { Defendant } from 'claims/models/defendant'
import Payment from 'app/pay/payment'

export default class ClaimData implements Serializable<ClaimData> {
  claimant: Claimant
  defendants: Defendant[]
  paidFeeAmount: number
  amount: number
  reason: string
  interest: Interest
  interestDate: InterestDate
  payment: Payment = new Payment()

  get defendant (): Defendant {
    if (this.defendants.length === 1) {
      return this.defendants[0]
    } else {
      throw new Error('This claim has multiple defendants')
    }
  }

  deserialize (input: any): ClaimData {
    if (input) {
      this.claimant = new Claimant().deserialize(input.claimant)

      this.defendants = input.defendants.map((defendant: any) => new Defendant().deserialize(defendant))
      this.payment = new Payment().deserialize(input.payment)
      this.amount = new ClaimAmountBreakdown().deserialize(input.amount).totalAmount()
      this.interest = new Interest().deserialize(input.interest)
      this.interestDate = new InterestDate().deserialize(input.interestDate)

      this.reason = input.reason
      this.paidFeeAmount = this.payment.amount / 100
    }
    return this
  }
}
