import { Moment } from 'moment'
import { ClaimData } from 'claims/models/claimData'
import { MomentFactory } from 'shared/momentFactory'
import { Response } from 'claims/models/response'
import { ResponseType } from 'claims/models/response/responseType'
import { CountyCourtJudgment } from 'claims/models/countyCourtJudgment'
import { ClaimantResponse } from 'claims/models/claimantResponse'
import { Settlement } from 'claims/models/settlement'
import { Offer } from 'claims/models/offer'
import { ClaimStatus } from 'claims/models/claimStatus'
import { isPastDeadline } from 'claims/isPastDeadline'
import { FullAdmissionResponse } from 'claims/models/response/fullAdmissionResponse'
import { PaymentOption } from 'claims/models/paymentOption'
import { CountyCourtJudgmentType } from 'claims/models/countyCourtJudgmentType'
import { ClaimantResponseType } from 'claims/models/claimant-response/claimantResponseType'
import { PartyType } from 'common/partyType'
import { calculateMonthIncrement } from 'common/calculate-month-increment/calculateMonthIncrement'
import { AcceptationClaimantResponse } from 'claims/models/claimant-response/acceptationClaimantResponse'
import { ReDetermination } from 'claims/models/claimant-response/reDetermination'
import { FormaliseOption } from 'claims/models/claimant-response/formaliseOption'

interface State {
  status: ClaimStatus
}

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
  response: Response
  claimantEmail: string
  countyCourtJudgment: CountyCourtJudgment
  countyCourtJudgmentRequestedAt: Moment
  countyCourtJudgmentIssuedAt: Moment
  defendantEmail: string
  settlement: Settlement
  settlementReachedAt: Moment
  claimantResponse: ClaimantResponse
  claimantRespondedAt: Moment
  totalAmountTillToday: number
  totalAmountTillDateOfIssue: number
  totalInterest: number
  features: string[]
  directionsQuestionnaireDeadline: Moment
  moneyReceivedOn: Moment
  reDetermination: ReDetermination
  reDeterminationRequestedAt: Moment

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
      if (input.countyCourtJudgmentIssuedAt) {
        this.countyCourtJudgmentIssuedAt = MomentFactory.parse(input.countyCourtJudgmentIssuedAt)
      }
      if (input.settlement) {
        this.settlement = new Settlement().deserialize(input.settlement)
      }
      if (input.settlementReachedAt) {
        this.settlementReachedAt = MomentFactory.parse(input.settlementReachedAt)
      }
      if (input.claimantResponse) {
        this.claimantResponse = ClaimantResponse.deserialize(input.claimantResponse)
      }
      if (input.claimantRespondedAt) {
        this.claimantRespondedAt = MomentFactory.parse(input.claimantRespondedAt)
      }
      this.totalAmountTillToday = input.totalAmountTillToday
      this.totalAmountTillDateOfIssue = input.totalAmountTillDateOfIssue
      this.totalInterest = input.totalInterest
      this.features = input.features
      if (input.directionsQuestionnaireDeadline) {
        this.directionsQuestionnaireDeadline = MomentFactory.parse(input.directionsQuestionnaireDeadline)
      }
      if (input.moneyReceivedOn) {
        this.moneyReceivedOn = MomentFactory.parse(input.moneyReceivedOn)
      }
      if (input.reDetermination) {
        this.reDetermination = ReDetermination.deserialize(input.reDetermination)
      }
      if (input.reDeterminationRequestedAt) {
        this.reDeterminationRequestedAt = MomentFactory.parse(input.reDeterminationRequestedAt)
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

  get respondToResponseDeadline (): Moment {
    if (!this.respondedAt) {
      return undefined
    }
    const daysForService = 5
    const daysForResponse = 28
    return this.respondedAt.clone().add(daysForService + daysForResponse, 'days')
  }

  get respondToMediationDeadline (): Moment {
    if (!this.respondedAt) {
      return undefined
    }
    return this.respondedAt.clone().add('5', 'days')
  }

  get remainingDays (): number {
    return this.responseDeadline.diff(MomentFactory.currentDate(), 'days')
  }

  get eligibleForCCJ (): boolean {
    return !this.countyCourtJudgmentRequestedAt
      && (this.isFullAdmissionPayImmediatelyPastPaymentDate()
        || this.hasDefendantNotSignedSettlementAgreementInTime()
        || (!this.respondedAt && isPastDeadline(MomentFactory.currentDateTime(), this.responseDeadline)
        )
      )
  }

  get eligibleForCCJAfterBreachedSettlement (): boolean {
    if (this.response && (this.response as FullAdmissionResponse).paymentIntention) {
      switch ((this.response as FullAdmissionResponse).paymentIntention.paymentOption) {
        case PaymentOption.BY_SPECIFIED_DATE :
          return !this.countyCourtJudgmentRequestedAt
            && this.isSettlementReached()
            && isPastDeadline(MomentFactory.currentDateTime(),
              (this.response as FullAdmissionResponse).paymentIntention.paymentDate)
          break
        case PaymentOption.INSTALMENTS:
          return !this.countyCourtJudgmentRequestedAt
            && this.isSettlementReached()
            && isPastDeadline(MomentFactory.currentDateTime(),
              (this.response as FullAdmissionResponse).paymentIntention.repaymentPlan.firstPaymentDate)
      }
    }
    return false
  }

  get status (): ClaimStatus {
    if (this.moneyReceivedOn && this.countyCourtJudgmentRequestedAt && this.isCCJPaidWithinMonth()) {
      return ClaimStatus.PAID_IN_FULL_CCJ_CANCELLED
    } else if (this.moneyReceivedOn && this.countyCourtJudgmentRequestedAt) {
      return ClaimStatus.PAID_IN_FULL_CCJ_SATISFIED
    } else if (this.moneyReceivedOn) {
      return ClaimStatus.PAID_IN_FULL
    } else if (this.countyCourtJudgmentRequestedAt) {
      if (this.hasClaimantAcceptedAdmissionWithCCJ()) {
        return ClaimStatus.CLAIMANT_ACCEPTED_ADMISSION_AND_REQUESTED_CCJ
      } else if (this.hasClaimantSuggestedAlternativePlanWithCCJ()) {
        return ClaimStatus.CLAIMANT_ALTERNATIVE_PLAN_WITH_CCJ
      } else if (this.hasRedeterminationBeenRequested()) {
        return ClaimStatus.REDETERMINATION_BY_JUDGE
      } else {
        return ClaimStatus.CCJ_REQUESTED
      }
    } else if (this.isSettlementAgreementRejected()) {
      return ClaimStatus.SETTLEMENT_AGREEMENT_REJECTED
    } else if (this.isSettlementReachedThroughAdmission()) {
      return ClaimStatus.ADMISSION_SETTLEMENT_AGREEMENT_REACHED
    } else if (this.isFullAdmissionPayImmediatelyPastPaymentDate()) {
      return ClaimStatus.ELIGIBLE_FOR_CCJ_AFTER_FULL_ADMIT_PAY_IMMEDIATELY_PAST_DEADLINE
    } else if (this.hasDefendantNotSignedSettlementAgreementInTime()) {
      return ClaimStatus.CLAIMANT_ACCEPTED_ADMISSION_AND_DEFENDANT_NOT_SIGNED
    } else if (this.hasClaimantAcceptedOfferAndSignedSettlementAgreement()) {
      return ClaimStatus.CLAIMANT_ACCEPTED_ADMISSION
    } else if (this.hasClaimantSignedSettlementAgreementChosenByCourt()) {
      return ClaimStatus.CLAIMANT_ACCEPTED_COURT_PLAN_SETTLEMENT
    } else if (this.isSettlementReached()) {
      return ClaimStatus.OFFER_SETTLEMENT_REACHED
    } else if (this.eligibleForCCJ) {
      return ClaimStatus.ELIGIBLE_FOR_CCJ
    } else if (this.isResponseSubmitted()) {
      return ClaimStatus.RESPONSE_SUBMITTED
    } else if (this.moreTimeRequested) {
      return ClaimStatus.MORE_TIME_REQUESTED
    } else if (this.hasClaimantRejectedPartAdmission()) {
      return ClaimStatus.CLAIMANT_REJECTS_PART_ADMISSION
    } else if (!this.response) {
      return ClaimStatus.NO_RESPONSE
    } else if (this.hasClaimantAcceptedPartAdmitPayImmediately()) {
      return ClaimStatus.PART_ADMIT_PAY_IMMEDIATELY
    } else if (this.hasClaimantRejectedDefendantResponse() &&
      (this.claimData.defendant.type === PartyType.COMPANY.value
        || this.claimData.defendant.type === PartyType.ORGANISATION.value)) {
      return ClaimStatus.CLAIMANT_REJECTED_DEFENDANT_AS_COMPANY_OR_ORGANISATION_RESPONSE
    } else if (this.isClaimantResponseSubmitted()) {
      return ClaimStatus.CLAIMANT_RESPONSE_SUBMITTED
    } else {
      throw new Error('Unknown Status')
    }
  }

  get stateHistory (): State[] {
    const statuses = [{ status: this.status }]
    if (this.isOfferRejected() && !this.settlement.isThroughAdmissions() && !this.moneyReceivedOn) {
      statuses.push({ status: ClaimStatus.OFFER_REJECTED })
    } else if (this.isOfferAccepted() && !this.settlement.isThroughAdmissions() && !this.moneyReceivedOn) {
      statuses.push({ status: ClaimStatus.OFFER_ACCEPTED })
    } else if (this.isOfferSubmitted() && !this.settlement.isThroughAdmissions() && !this.moneyReceivedOn) {
      statuses.push({ status: ClaimStatus.OFFER_SUBMITTED })
    }
    if (this.eligibleForCCJAfterBreachedSettlement) {
      statuses.push({ status: ClaimStatus.ELIGIBLE_FOR_CCJ_AFTER_BREACHED_SETTLEMENT })
    }
    if (!this.moneyReceivedOn || (!this.moneyReceivedOn && !this.countyCourtJudgmentRequestedAt)) {
      statuses.push({ status: ClaimStatus.PAID_IN_FULL_ELIGIBLE })
    }

    return statuses
  }

  private isResponseSubmitted (): boolean {
    return this.response !== undefined && !this.claimantResponse
  }

  private isOfferSubmitted (): boolean {
    return this.settlement && this.response && this.response.responseType === ResponseType.FULL_DEFENCE
  }

  private isOfferAccepted (): boolean {
    return this.settlement && this.settlement.isOfferAccepted()
  }

  private isOfferRejected (): boolean {
    return this.settlement && this.settlement.isOfferRejected()
  }

  private isSettlementReached (): boolean {
    return this.settlement && !!this.settlementReachedAt
  }

  private isCCJPaidWithinMonth (): boolean {
    return this.moneyReceivedOn.isSameOrBefore(calculateMonthIncrement(this.countyCourtJudgmentRequestedAt))
  }

  private isSettlementReachedThroughAdmission (): boolean {
    return this.settlement && this.settlement.isThroughAdmissionsAndSettled()
  }

  private isSettlementAgreementRejected (): boolean {
    if (!this.claimantResponse || this.claimantResponse.type !== ClaimantResponseType.ACCEPTATION) {
      return false
    }
    const claimantResponse: AcceptationClaimantResponse = this.claimantResponse
    return claimantResponse.formaliseOption === FormaliseOption.SETTLEMENT
      && this.settlement && this.settlement.isOfferRejected()
  }

  private isFullAdmissionPayImmediatelyPastPaymentDate (): boolean {
    if (this.response && this.response.responseType === ResponseType.FULL_ADMISSION) {
      const response: FullAdmissionResponse = this.response
      return this.isResponseSubmitted() && response.paymentIntention.paymentOption === PaymentOption.IMMEDIATELY &&
        response.paymentIntention && response.paymentIntention.paymentDate.isBefore(MomentFactory.currentDateTime())
    } else {
      return false
    }
  }

  private hasClaimantAcceptedOfferAndSignedSettlementAgreement (): boolean {
    return this.settlement && this.settlement.isOfferAccepted() && this.settlement.isThroughAdmissions() &&
      this.claimantResponse && !(this.claimantResponse as AcceptationClaimantResponse).courtDetermination
  }

  private hasClaimantSignedSettlementAgreementChosenByCourt (): boolean {
    return this.settlement && this.settlement.isOfferAccepted() && this.settlement.isThroughAdmissions() &&
      this.claimantResponse && !!(this.claimantResponse as AcceptationClaimantResponse).courtDetermination
  }

  private hasDefendantNotSignedSettlementAgreementInTime (): boolean {
    return this.settlement && this.settlement.isOfferAccepted() && this.settlement.isThroughAdmissions() &&
      this.claimantRespondedAt && this.claimantRespondedAt.clone().add('7', 'days').isBefore(MomentFactory.currentDate())
  }

  hasClaimantAcceptedAdmissionWithCCJ (): boolean {
    return this.countyCourtJudgment && this.response &&
      (this.response.responseType === ResponseType.FULL_ADMISSION || this.response.responseType === ResponseType.PART_ADMISSION) &&
      !(this.claimantResponse as AcceptationClaimantResponse).courtDetermination && !this.reDeterminationRequestedAt
  }

  private hasClaimantRejectedDefendantResponse (): boolean {
    return this.claimantResponse && this.claimantResponse.type === ClaimantResponseType.REJECTION
  }

  hasClaimantAcceptedDefendantResponseWithCCJ (): boolean {
    return this.claimantResponse
      && this.claimantResponse.type === ClaimantResponseType.ACCEPTATION
      && this.countyCourtJudgmentRequestedAt !== undefined
      && this.countyCourtJudgment !== undefined
  }

  hasClaimantAcceptedDefendantResponseWithSettlement (): boolean {
    return this.claimantResponse
      && this.claimantResponse.type === ClaimantResponseType.ACCEPTATION
      && this.settlement !== undefined
  }

  private isClaimantResponseSubmitted (): boolean {
    return this.response !== undefined && this.claimantResponse !== undefined && !this.reDeterminationRequestedAt
  }

  isEligibleForReDetermination (): boolean {
    const dateAfter19Days = this.countyCourtJudgmentRequestedAt && this.countyCourtJudgmentRequestedAt.clone().add(19, 'days')
    return this.countyCourtJudgment && this.countyCourtJudgment.ccjType === CountyCourtJudgmentType.DETERMINATION
      && MomentFactory.currentDateTime().isBefore(dateAfter19Days)
      && this.reDeterminationRequestedAt === undefined
  }

  private hasClaimantSuggestedAlternativePlanWithCCJ (): boolean {
    return this.claimantResponse && this.countyCourtJudgmentRequestedAt &&
      !!(this.claimantResponse as AcceptationClaimantResponse).courtDetermination && !this.reDeterminationRequestedAt
  }

  private hasRedeterminationBeenRequested (): boolean {
    return this.claimantResponse && this.countyCourtJudgmentRequestedAt && !!this.reDeterminationRequestedAt
  }

  private hasClaimantRejectedPartAdmission (): boolean {
    return this.claimantResponse && this.claimantResponse.type === ClaimantResponseType.REJECTION && !this.claimData.defendant.isBusiness()
  }

  private hasClaimantAcceptedPartAdmitPayImmediately (): boolean {
    return this.claimantResponse && this.claimantResponse.type === ClaimantResponseType.ACCEPTATION &&
      this.response.responseType === ResponseType.PART_ADMISSION && this.response.paymentIntention.paymentOption === PaymentOption.IMMEDIATELY
  }
}
