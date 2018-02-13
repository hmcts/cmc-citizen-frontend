import { Moment } from 'moment'
import { ClaimData } from 'app/claims/models/claimData'
import { MomentFactory } from 'common/momentFactory'
import * as config from 'config'
import * as toBoolean from 'to-boolean'
import { CountyCourtJudgment } from 'claims/models/countyCourtJudgment'
import { Response } from 'claims/models/response'
import { ResponseType } from 'claims/models/response/responseCommon'
import { Settlement } from 'claims/models/settlement'
import { Offer } from 'claims/models/offer'
import { ClaimStatus } from 'claims/models/claimStatus'
import { FeatureToggles } from 'utils/featureToggles'
import { FreeMediationOption } from 'response/form/models/freeMediation'

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
  totalAmountTillToday: number
  totalAmountTillDateOfIssue: number

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
      this.totalAmountTillToday = input.totalAmountTillToday
      this.totalAmountTillDateOfIssue = input.totalAmountTillDateOfIssue
    }
    return this
  }

  get defendantOffer (): Offer {
    if (!this.settlement) {
      return undefined
    }

    return this.settlement.getDefendantOffer()
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
    } else if (this.isSettlementReached()) {
      return ClaimStatus.OFFER_SETTLEMENT_REACHED
    } else if (this.isOfferSubmitted()) {
      return ClaimStatus.OFFER_SUBMITTED
    } else if (this.eligibleForCCJ) {
      return ClaimStatus.ELIGIBLE_FOR_CCJ
    } else if (this.isFreeMediationRequested()) {
      return ClaimStatus.FREE_MEDIATION
    } else if (this.isClaimRejected()) {
      return ClaimStatus.CLAIM_REJECTED
    } else if (this.moreTimeRequested) {
      return ClaimStatus.MORE_TIME_REQUESTED
    } else if (!this.response) {
      return ClaimStatus.NO_RESPONSE
    } else {
      throw new Error('Unknown Status')
    }
  }

  private isFreeMediationRequested () {
    return this.response && this.response.responseType === ResponseType.FULL_DEFENCE
      && this.response.freeMediation === FreeMediationOption.YES
  }

  private isOfferSubmitted () {
    return FeatureToggles.isEnabled('offer')
      && this.settlement && this.response && this.response.responseType === ResponseType.FULL_DEFENCE
  }

  private isSettlementReached () {
    return FeatureToggles.isEnabled('offer') && this.settlement && this.settlementReachedAt
  }

  private isClaimRejected () {
    return this.response && this.response.responseType === ResponseType.FULL_DEFENCE
  }
}
