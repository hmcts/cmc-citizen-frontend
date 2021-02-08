import { ClaimAmountBreakdown } from 'features/claim/form/models/claimAmountBreakdown'
import { MoneyConverter } from 'fees/moneyConverter'
import { Party } from 'claims/models/details/yours/party'
import { Individual as ClaimantAsIndividual } from 'claims/models/details/yours/individual'
import { Company as ClaimantAsCompany } from 'claims/models/details/yours/company'
import { SoleTrader as ClaimantAsSoleTrader } from 'claims/models/details/yours/soleTrader'
import { TheirDetails } from 'claims/models/details/theirs/theirDetails'
import { Organisation as ClaimantAsOrganisation } from 'claims/models/details/yours/organisation'
import { PartyType } from 'common/partyType'
import { Individual as DefendantAsIndividual } from 'claims/models/details/theirs/individual'
import { Company as DefendantAsCompany } from 'claims/models/details/theirs/company'
import { SoleTrader as DefendantAsSoleTrader } from 'claims/models/details/theirs/soleTrader'
import { Organisation as DefendantAsOrganisation } from 'claims/models/details/theirs/organisation'
import { Payment } from 'payment-hub-client/payment'
import { StatementOfTruth } from 'claims/models/statementOfTruth'
import { ClaimantTimeline } from 'claim/form/models/claimantTimeline'
import { Evidence } from 'forms/models/evidence'
import { InterestDate } from 'claims/models/interestDate'
import { Interest } from 'claims/models/interest'
import { Moment } from 'moment'
import { MomentFactory } from 'shared/momentFactory'

export class ClaimData {
  externalId: string
  claimants: Party[]
  defendants: TheirDetails[]
  amount: ClaimAmountBreakdown = new ClaimAmountBreakdown()
  feeAmountInPennies: number
  reason: string
  timeline: ClaimantTimeline
  evidence: Evidence
  interest: Interest
  payment: Payment = new Payment()
  statementOfTruth?: StatementOfTruth
  helpWithFeesNumber?: string
  helpWithFeesType?: string
  hwfFeeDetailsSummary?: string
  hwfMandatoryDetails?: string
  moreInfoDetails?: string
  feeRemitted?: number
  hwfDocumentsToBeSentBefore?: Moment
  hwfMoreInfoNeededDocuments?: string[]

  get claimant (): Party {
    if (this.claimants.length === 1) {
      return this.claimants[0]
    } else {
      throw new Error('This claim has multiple claimants')
    }
  }

  get defendant (): TheirDetails {
    if (this.defendants.length === 1) {
      return this.defendants[0]
    } else {
      throw new Error('This claim has multiple defendants')
    }
  }

  deserialize (input: any): ClaimData {
    if (input) {
      this.claimants = this.deserializeClaimants(input.claimants)
      this.defendants = this.deserializeDefendants(input.defendants)
      if (input.payment) {
        this.payment = Payment.deserialize(input.payment)
      }
      this.feeAmountInPennies = input.feeAmountInPennies

      this.amount = new ClaimAmountBreakdown().deserialize(input.amount)

      this.reason = input.reason
      this.amount = new ClaimAmountBreakdown().deserialize(input.amount)
      this.reason = input.reason
      this.timeline = ClaimantTimeline.fromObject(input.timeline)
      this.evidence = Evidence.fromObject(input.evidence)
      this.externalId = input.externalId
      this.interest = new Interest().deserialize(input.interest)

      //
      // NOTE: To be removed once data model migration is completed.
      //
      // `interestDate` prior migration completion can be provided in `claimData`
      // in which case we still handle it for backward compatibility reasons.
      //
      if (input.interestDate) {
        this.interest.interestDate = new InterestDate().deserialize(input.interestDate)
      }

      if (input.statementOfTruth) {
        this.statementOfTruth = new StatementOfTruth().deserialize(input.statementOfTruth)
      }

      // help with fees
      if (input.helpWithFeesNumber) {
        this.helpWithFeesNumber = input.helpWithFeesNumber
      }
      // help with fees type
      if (input.helpWithFeesType) {
        this.helpWithFeesType = 'ClaimIssue'
      }
      if (input.hwfFeeDetailsSummary) {
        this.hwfFeeDetailsSummary = input.hwfFeeDetailsSummary
      }
      if (input.hwfMandatoryDetails) {
        this.hwfMandatoryDetails = input.hwfMandatoryDetails
      }
      if (input.moreInfoDetails) {
        this.moreInfoDetails = input.moreInfoDetails
      }
      if (input.feeRemitted) {
        this.feeRemitted = MoneyConverter.convertPenniesToPounds(input.feeRemitted)
      }
      if (input.hwfMoreInfoNeededDocuments) {
        this.hwfMoreInfoNeededDocuments = input.hwfMoreInfoNeededDocuments
      }
      if (input.hwfDocumentsToBeSentBefore) {
        this.hwfDocumentsToBeSentBefore = MomentFactory.parse(input.hwfDocumentsToBeSentBefore)
      }
    }
    return this
  }

  private deserializeClaimants (claimants: any): Party[] {
    if (claimants) {
      return claimants.map((claimant: any) => {
        switch (claimant.type) {
          case PartyType.INDIVIDUAL.value:
            return new ClaimantAsIndividual().deserialize(claimant)
          case PartyType.COMPANY.value:
            return new ClaimantAsCompany().deserialize(claimant)
          case PartyType.SOLE_TRADER_OR_SELF_EMPLOYED.value:
            return new ClaimantAsSoleTrader().deserialize(claimant)
          case PartyType.ORGANISATION.value:
            return new ClaimantAsOrganisation().deserialize(claimant)
          default:
            throw Error('Something went wrong, No claimant type is set')
        }
      })
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
