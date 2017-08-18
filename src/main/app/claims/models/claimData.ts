import { Serializable } from 'app/models/serializable'
import ClaimAmountBreakdown from 'app/forms/models/claimAmountBreakdown'
import InterestDate from 'app/claims/models/interestDate'
import Interest from 'app/forms/models/interest'
import Party from './party'
import Individual from './individual'
import Company from './company'
import SoleTrader from './soleTrader'
import Organisation from './organisation'
import { PartyType } from 'forms/models/partyType'
import { Defendant } from 'claims/models/defendant'
import Payment from 'app/pay/payment'

export default class ClaimData implements Serializable<ClaimData> {
  claimant: Party
  defendant: TheirDetails
  paidFeeAmount: number
  amount: number
  reason: string
  interest: Interest
  interestDate: InterestDate
  payment: Payment = new Payment()

  deserialize (input: any): ClaimData {
    if (input) {
      if (this.claimant) {
        switch (this.claimant.type) {
          case PartyType.INDIVIDUAL.value:
            this.claimant = new Individual().deserialize(input.claimant.value)
            break
          case PartyType.COMPANY.value:
            this.claimant = new Company().deserialize(input.claimant.value)
            break
          case PartyType.SOLE_TRADER_OR_SELF_EMPLOYED.value:
            this.claimant = new SoleTrader().deserialize(input.claimant)
            break
          case PartyType.ORGANISATION.value:
            this.claimant = new Organisation().deserialize(input.claimant)
            break
          default:
            throw Error('Something went wrong, No claimant type is set')
        }
      }
      if (input.payment) {
        this.payment = new Payment().deserialize(input.payment)
      }
      this.defendant = new Defendant().deserialize(input.defendant)
      this.paidFeeAmount = this.payment.amount / 100
      this.amount = new ClaimAmountBreakdown().deserialize(input.amount).totalAmount()
      this.reason = input.reason
      if (input.interest) {
        this.interest = new Interest().deserialize(input.interest)
      }
      this.interestDate = new InterestDate().deserialize(input.interestDate)
    }
    return this
  }
}
