import { Moment } from 'moment'
import { ClaimData } from 'app/claims/models/claimData'
import { MomentFactory } from 'common/momentFactory'
import { InterestDateType } from 'app/common/interestDateType'
import { calculateInterest } from 'app/common/calculateInterest'
import * as config from 'config'
import * as toBoolean from 'to-boolean'
import { CountyCourtJudgment } from 'claims/models/countyCourtJudgment'
import { Response } from 'claims/models/response'
import { ResponseType } from 'claims/models/response/responseCommon'
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
    if (this.countyCourtJudgmentRequestedAt) {
      return ClaimStatus.CCJ_REQUESTED
    } else if (this.eligibleForCCJ) {
      return ClaimStatus.ELIGIBLE_FOR_CCJ
    } else if (toBoolean(config.get<boolean>('featureToggles.offer')) && this.settlement && this.response.responseType === ResponseType.FULL_DEFENCE) {
      return ClaimStatus.OFFER_SUBMITTED
    } else if (this.response && this.response.responseType === ResponseType.FULL_DEFENCE && this.response.freeMediation === 'yes') {
      return ClaimStatus.FREE_MEDIATION
    } else if (this.response && this.response.responseType === ResponseType.FULL_DEFENCE) {
      return ClaimStatus.CLAIM_REJECTED
    } else if (this.moreTimeRequested) {
      return ClaimStatus.MORE_TIME_REQUESTED
    } else {
      return ClaimStatus.NO_RESPONSE
    }
  }
}
