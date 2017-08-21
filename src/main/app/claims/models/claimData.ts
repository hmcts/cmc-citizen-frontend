import { Serializable } from 'app/models/serializable'
import ClaimAmountBreakdown from 'app/forms/models/claimAmountBreakdown'
import InterestDate from 'app/claims/models/interestDate'
import Interest from 'app/forms/models/interest'
import { Party } from 'claims/models/details/yours/party'
import { Individual as ClaimantAsIndividual } from 'claims/models/details/yours/individual'
import { Company as ClaimantAsCompany } from 'claims/models/details/yours/company'
import { SoleTrader as ClaimantAsSoleTrader } from 'claims/models/details/yours/soleTrader'
import { TheirDetails } from 'claims/models/details/theirs/theirDetails'
import { Organisation as ClaimantAsOrganisation } from 'claims/models/details/yours/organisation'
import { PartyType } from 'forms/models/partyType'
import { Individual as DefendantAsIndividual } from 'claims/models/details/theirs/individual'
import { Company as DefendantAsCompany } from 'claims/models/details/theirs/company'
import { SoleTrader as DefendantAsSoleTrader } from 'claims/models/details/theirs/soleTrader'
import { Organisation as DefendantAsOrganisation } from 'claims/models/details/theirs/organisation'
import Payment from 'app/pay/payment'

export default class ClaimData implements Serializable<ClaimData> {
  externalId: string
  claimant: Party
  defendant: TheirDetails
  paidFeeAmount: number
  amount: ClaimAmountBreakdown = new ClaimAmountBreakdown()
  reason: string
  interest: Interest
  interestDate: InterestDate
  payment: Payment = new Payment()

  deserialize (input: any): ClaimData {
    if (input) {
      if (input.claimant) {
        switch (input.claimant.type) {
          case PartyType.INDIVIDUAL.value:
            this.claimant = new ClaimantAsIndividual().deserialize(input.claimant)
            break
          case PartyType.COMPANY.value:
            this.claimant = new ClaimantAsCompany().deserialize(input.claimant)
            break
          case PartyType.SOLE_TRADER_OR_SELF_EMPLOYED.value:
            this.claimant = new ClaimantAsSoleTrader().deserialize(input.claimant)
            break
          case PartyType.ORGANISATION.value:
            this.claimant = new ClaimantAsOrganisation().deserialize(input.claimant)
            break
          default:
            throw Error('Something went wrong, No claimant type is set')
        }
      }
      if (input.payment) {
        this.payment = new Payment().deserialize(input.payment)
      }
      if (input.defendant) {
        switch (input.defendant.type) {
          case PartyType.INDIVIDUAL.value:
            this.defendant = new DefendantAsIndividual().deserialize(input.defendant)
            break
          case PartyType.COMPANY.value:
            this.defendant = new DefendantAsCompany().deserialize(input.defendant)
            break
          case PartyType.SOLE_TRADER_OR_SELF_EMPLOYED.value:
            this.defendant = new DefendantAsSoleTrader().deserialize(input.defendant)
            break
          case PartyType.ORGANISATION.value:
            this.defendant = new DefendantAsOrganisation().deserialize(input.defendant)
            break
          default:
            throw Error('Something went wrong, No defendant type is set')
        }
      }
      this.paidFeeAmount = this.payment.amount / 100
      this.amount = new ClaimAmountBreakdown().deserialize(input.amount)
      this.reason = input.reason
      this.externalId = input.externalId
      if (input.interest) {
        this.interest = new Interest().deserialize(input.interest)
      }
      this.interestDate = new InterestDate().deserialize(input.interestDate)
    }
    return this
  }
}
