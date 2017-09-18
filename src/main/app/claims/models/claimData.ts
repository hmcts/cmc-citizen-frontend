import { Serializable } from 'app/models/serializable'
import ClaimAmountBreakdown from 'app/forms/models/claimAmountBreakdown'
import InterestDate from 'app/claims/models/interestDate'
import Interest from 'app/forms/models/interest'
import { QualifiedStatementOfTruth } from 'app/forms/models/qualifiedStatementOfTruth'
import { Party } from 'claims/models/details/yours/party'
import { Individual as ClaimantAsIndividual } from 'claims/models/details/yours/individual'
import { Company as ClaimantAsCompany } from 'claims/models/details/yours/company'
import { SoleTrader as ClaimantAsSoleTrader } from 'claims/models/details/yours/soleTrader'
import { TheirDetails } from 'claims/models/details/theirs/theirDetails'
import { Organisation as ClaimantAsOrganisation } from 'claims/models/details/yours/organisation'
import { PartyType } from 'app/common/partyType'
import { Individual as DefendantAsIndividual } from 'claims/models/details/theirs/individual'
import { Company as DefendantAsCompany } from 'claims/models/details/theirs/company'
import { SoleTrader as DefendantAsSoleTrader } from 'claims/models/details/theirs/soleTrader'
import { Organisation as DefendantAsOrganisation } from 'claims/models/details/theirs/organisation'
import Payment from 'app/pay/payment'

export default class ClaimData implements Serializable<ClaimData> {
  externalId: string
  claimant: Party
  defendants: TheirDetails[]
  amount: ClaimAmountBreakdown = new ClaimAmountBreakdown()
  feeAmountInPennies: number
  reason: string
  interest: Interest
  interestDate: InterestDate
  payment: Payment = new Payment()
  statementOfTruth?: QualifiedStatementOfTruth

  get defendant (): TheirDetails {
    if (this.defendants.length === 1) {
      return this.defendants[0]
    } else {
      throw new Error('This claim has multiple defendants')
    }
  }

  get paidFeeAmount (): number {
    return this.payment.amount / 100
  }

  deserialize (input: any): ClaimData {
    if (input) {
      this.claimant = this.deserializeClaimant(input.claimant)
      this.defendants = this.deserializeDefendants(input.defendants)
      if (input.payment) {
        this.payment = new Payment().deserialize(input.payment)
      }
      this.feeAmountInPennies = input.feeAmountInPennies

      this.payment = new Payment().deserialize(input.payment)
      this.amount = new ClaimAmountBreakdown().deserialize(input.amount)
      this.interest = new Interest().deserialize(input.interest)
      this.interestDate = new InterestDate().deserialize(input.interestDate)

      this.reason = input.reason
      this.amount = new ClaimAmountBreakdown().deserialize(input.amount)
      this.reason = input.reason
      this.externalId = input.externalId
      if (input.interest) {
        this.interest = new Interest().deserialize(input.interest)
      }
      if (input.interestDate) {
        this.interestDate = new InterestDate().deserialize(input.interestDate)
      }
      if (input.statementOfTruth) {
        this.statementOfTruth = new QualifiedStatementOfTruth().deserialize(input.statementOfTruth)
      }
    }
    return this
  }

  private deserializeClaimant (claimant: any): Party {
    if (claimant) {
      switch (claimant.type) {
        case PartyType.INDIVIDUAL.value:
          return this.claimant = new ClaimantAsIndividual().deserialize(claimant)
        case PartyType.COMPANY.value:
          return this.claimant = new ClaimantAsCompany().deserialize(claimant)
        case PartyType.SOLE_TRADER_OR_SELF_EMPLOYED.value:
          return this.claimant = new ClaimantAsSoleTrader().deserialize(claimant)
        case PartyType.ORGANISATION.value:
          return this.claimant = new ClaimantAsOrganisation().deserialize(claimant)
        default:
          throw Error('Something went wrong, No claimant type is set')
      }
    }
  }

  private deserializeDefendants (defendants: any[]): TheirDetails[] {
    if (defendants) {
      return defendants.map((defendant: any) => {
        switch (defendant.type) {
          case PartyType.INDIVIDUAL.value:
            return new DefendantAsIndividual().deserialize(defendant)
          case PartyType.COMPANY.value:
            return new DefendantAsCompany().deserialize(defendant)
          case PartyType.SOLE_TRADER_OR_SELF_EMPLOYED.value:
            return new DefendantAsSoleTrader().deserialize(defendant)
          case PartyType.ORGANISATION.value:
            return new DefendantAsOrganisation().deserialize(defendant)
          default:
            throw Error('Something went wrong, No defendant type is set')
        }
      })
    }
  }
}
