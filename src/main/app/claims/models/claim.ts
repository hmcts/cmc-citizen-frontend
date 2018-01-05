import { Moment } from 'moment'
import { ClaimData } from 'app/claims/models/claimData'
import { MomentFactory } from 'common/momentFactory'
import { InterestDateType } from 'app/common/interestDateType'
import { calculateInterest } from 'app/common/calculateInterest'
import * as config from 'config'
import * as toBoolean from 'to-boolean'
import { CountyCourtJudgment } from 'claims/models/countyCourtJudgment'
import { Response } from 'claims/models/response'
import { Settlement } from 'claims/models/settlement'
import { Offer } from 'claims/models/offer'
import { Interest, InterestType } from 'claim/form/models/interest'
import { InterestDate } from 'claims/models/interestDate'
import { ClaimStatus } from 'claims/models/claimStatus'

export class Claim {
  id: number
  claimantId: string
  externalId: string
  defendantId: string
  claimNumber: string
  responseDeadline: Moment
  createdAt: Moment
  issuedOn: Moment
  claimData: ClaimData
  moreTimeRequested: boolean
  respondedAt: Moment
  claimantEmail: string
  countyCourtJudgment: CountyCourtJudgment
  countyCourtJudgmentRequestedAt: Moment
  response: Response
  defendantEmail: string
  settlement: Settlement
  settlementReachedAt: Moment

  deserialize (input: any): Claim {
    if (input) {
      this.id = input.id
      this.claimantId = input.submitterId
      this.externalId = input.externalId
      this.defendantId = input.defendantId
      this.claimNumber = input.referenceNumber
      this.createdAt = MomentFactory.parse(input.createdAt)
      this.responseDeadline = MomentFactory.parse(input.responseDeadline)
      this.issuedOn = MomentFactory.parse(input.issuedOn)
      this.claimData = new ClaimData().deserialize(input.claim)
      this.moreTimeRequested = input.moreTimeRequested
      if (input.respondedAt) {
        this.respondedAt = MomentFactory.parse(input.respondedAt)
      }
      if (input.defendantEmail) {
        this.defendantEmail = input.defendantEmail
      }
      if (input.response) {
        this.response = Response.deserialize(input.response)
      }
      this.claimantEmail = input.submitterEmail
      this.countyCourtJudgment = new CountyCourtJudgment().deserialize(input.countyCourtJudgment)
      if (input.countyCourtJudgmentRequestedAt) {
        this.countyCourtJudgmentRequestedAt = MomentFactory.parse(input.countyCourtJudgmentRequestedAt)
      }
      if (input.settlement) {
        this.settlement = new Settlement().deserialize(input.settlement)
      }
      if (input.settlementReachedAt) {
        this.settlementReachedAt = MomentFactory.parse(input.settlementReachedAt)
      }
    }
    return this
  }

  get defendantOffer (): Offer {
    if (!this.settlement) {
      return undefined
    }

    return this.settlement.getDefendantOffer()
  }

  get totalAmountTillToday (): number {
    return this.calculateTotalAmountTillDate(MomentFactory.currentDateTime())
  }

  get totalAmountTillDateOfIssue (): number {
    return this.calculateTotalAmountTillDate(this.createdAt)
  }

  private calculateTotalAmountTillDate (toDate: Moment): number {
    const claimAmount: number = this.claimData.amount.totalAmount()
    const interestRate: Interest = this.claimData.interest

    let interest: number = 0
    if (interestRate.type !== InterestType.NO_INTEREST) {
      const interestDate: InterestDate = this.claimData.interestDate
      const fromDate: Moment = interestDate.type === InterestDateType.SUBMISSION ? this.createdAt : interestDate.date

      interest = calculateInterest(claimAmount, interestRate, fromDate, toDate)
    }

    return claimAmount + this.claimData.paidFeeAmount + interest
  }

  // noinspection JSUnusedGlobalSymbols Called in the view
  get remainingDays (): number {
    return this.responseDeadline.diff(MomentFactory.currentDate(), 'days')
  }

  get eligibleForCCJ (): boolean {
    if (!toBoolean(config.get<boolean>('featureToggles.countyCourtJudgment'))) {
      return false
    }

    return !this.countyCourtJudgmentRequestedAt && this.remainingDays < 0 && !this.respondedAt
  }

  get status (): ClaimStatus {
    if (this.eligibleForCCJ) {
      return ClaimStatus.ELIGIBLE_FOR_CCJ
      // Claimant ('Request a County Court Judgment.')
    }

    if (this.countyCourtJudgmentRequestedAt) {
      return ClaimStatus.CCJ_REQUESTED
      // Claimant ('You requested a County Court Judgment on %s. We will contact you within 5 working days.')
      //  -  need to return date
      // Defendant - '[claim.claimData.claimant.name] requested a County Court Judgment against you on
      // [claim.countyCourtJudgmentRequestedAt]. We will contact you both within 5 working days.
    }
    /* MISSING
    {% elseif claim.settlementReachedAt  %}
    {{ claimSettledStatus(url) }}
     */
    if (toBoolean(config.get<boolean>('featureToggles.offer')) && this.settlement) {
      return ClaimStatus.OFFER_SUBMITTED
      // Claimant - '[claim.claimData.defendant.name] wants to settle out of court. View <a href="URL">their offer
      // Defendant - Todo Dont have offer message for defendant
    }

    if (this.moreTimeRequested) {
      return ClaimStatus.MORE_TIME_REQUESTED
      // Claimant - ('[claim.claimData.defendant.name] has requested an extra 14 days to respond.
      // Defendant - TODO - dont have more time requested message
      // They need to respond by [claim.responseDeadline])
    }

    if (this.response && this.response.type === ResponseType.OWE_ALL_PAID_ALL) {
      return ClaimStatus.CLAIM_REJECTED
      // Claimant -  ('[claim.claimData.defendant.name ] has rejected the claim. The case will be reviewed by a judge
      // and might go to court.',
      // Defendant - 'You’ve rejected the claim. The case will be reviewed by a judge and might go to court.'
      // Todo -
    }

    if (this.response && this.response.type === ResponseType.OWE_NONE && claim.response.freeMediation === 'yes') {

      // Claimant - '[claim.response.defendant.name] has rejected the claim.
      // They’ve suggested free mediation on [claim.respondedAt]. You need to respond within 5 working days.')
    }

    if (this.response) {
      return ClaimStatus.CLAIM_REJECTED
      // Claimant - [claim.response.defendant.name] rejected the claim.
      // The case will be reviewed by a judge and might go to court.'
    }

    if (!this.response) {
      return ClaimStatus.NO_RESPONSE
      // Claimant - (Your claim is being processed. We will email you to explain what to do next.')
      /*
      The original below seems wrong Todo check with Damian
      {% elseif claim.response %}
         {{ t('%s rejected the claim. The case will be reviewed by a judge and might go to court.',
        { postProcess: 'sprintf', sprintf: [ claim.response.defendant.name ]})
       }}
       */
    }
  }
}
