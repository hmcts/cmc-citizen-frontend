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
import { calculateMonthIncrement } from 'common/calculate-month-increment/calculateMonthIncrement'
import { AcceptationClaimantResponse } from 'claims/models/claimant-response/acceptationClaimantResponse'
import { ReDetermination } from 'claims/models/claimant-response/reDetermination'
import { FormaliseOption } from 'claims/models/claimant-response/formaliseOption'
import { StatementType } from 'offer/form/models/statementType'
import { DateOfBirth } from 'forms/models/dateOfBirth'
import { Individual } from 'claims/models/details/yours/individual'
import { LocalDate } from 'forms/models/localDate'
import { PartyType } from 'common/partyType'
import { DefenceType } from 'claims/models/response/defenceType'
import { PartialAdmissionResponse } from 'claims/models/response/partialAdmissionResponse'

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

  // used in a nunjucks template
  get remainingDays (): number {
    return this.responseDeadline.diff(MomentFactory.currentDate(), 'days')
  }

  get isFullAdmission (): boolean {
    return this.response && this.response.responseType === ResponseType.FULL_ADMISSION
  }

  get isPayImmediately (): boolean {
    const response = (this.response as FullAdmissionResponse | PartialAdmissionResponse)
    return response && response.paymentIntention && response.paymentIntention.paymentOption === PaymentOption.IMMEDIATELY
  }

  get isPayBySetDate (): boolean {
    const response = (this.response as FullAdmissionResponse | PartialAdmissionResponse)
    return response && response.paymentIntention && response.paymentIntention.paymentOption === PaymentOption.BY_SPECIFIED_DATE
  }

  get isPayByInstalments (): boolean {
    const response = (this.response as FullAdmissionResponse | PartialAdmissionResponse)
    return response && response.paymentIntention && response.paymentIntention.paymentOption === PaymentOption.INSTALMENTS
  }

  get isPaymentPastDeadline (): boolean {
    const response = (this.response as FullAdmissionResponse | PartialAdmissionResponse)
    return response.paymentIntention.paymentDate.isBefore(MomentFactory.currentDateTime())
  }

  get hasCCJBeenRequested (): boolean {
    return !!this.countyCourtJudgmentRequestedAt
  }

  get hasClaimantAccepted (): boolean {
    return this.claimantResponse && this.claimantResponse.type === ClaimantResponseType.ACCEPTATION
  }

  get isCCJ (): boolean {
    return (this.claimantResponse as AcceptationClaimantResponse).formaliseOption === FormaliseOption.CCJ
  }

  get isReferToJudge (): boolean {
    return (this.claimantResponse as AcceptationClaimantResponse).formaliseOption === FormaliseOption.REFER_TO_JUDGE
  }

  get isSettlement (): boolean {
    return (this.claimantResponse as AcceptationClaimantResponse).formaliseOption === FormaliseOption.SETTLEMENT
  }

  get hasAlternativePaymentIntention (): boolean {
    return !!(this.claimantResponse as AcceptationClaimantResponse).claimantPaymentIntention
  }

  private isDefendantBusiness (): boolean {
    return this.claimData && this.claimData.defendant && this.claimData.defendant.isBusiness()
  }

  get isResponsePastDeadline (): boolean {
    return !this.respondedAt && isPastDeadline(MomentFactory.currentDateTime(), this.responseDeadline)
  }

  get eligibleForCCJ (): boolean {
    return !this.countyCourtJudgmentRequestedAt
      && (this.admissionPayImmediatelyPastPaymentDate
        || this.hasDefendantNotSignedSettlementAgreementInTime()
        || (!this.respondedAt && isPastDeadline(MomentFactory.currentDateTime(), this.responseDeadline)
          || this.isSettlementAgreementRejected()
        )
      )
  }

  get hasBreachedSettlementTerms (): boolean {
    if (this.response && this.settlement && this.settlement.isThroughAdmissionsAndSettled()) {
      const lastOffer: Offer = this.settlement.getLastOffer()
      if (lastOffer && lastOffer.paymentIntention) {
        const paymentOption = lastOffer.paymentIntention.paymentOption
        switch (paymentOption) {
          case PaymentOption.BY_SPECIFIED_DATE:
            return isPastDeadline(MomentFactory.currentDateTime(),
                (this.settlement.partyStatements.filter(o => o.type === StatementType.OFFER.value).pop().offer.completionDate))

          case PaymentOption.INSTALMENTS:
            return isPastDeadline(MomentFactory.currentDateTime(),
                (this.settlement.partyStatements.filter(o => o.type === StatementType.OFFER.value).pop().offer.paymentIntention.repaymentPlan.firstPaymentDate))

          default:
            throw new Error(`Payment option ${paymentOption} is not supported`)
        }
      }
    }
    return false
  }

  get eligibleForCCJAfterBreachedSettlementTerms (): boolean {
    return !this.countyCourtJudgmentRequestedAt && this.hasBreachedSettlementTerms
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
      } else if (this.hasCCJBeenRequestedAfterSettlementBreached()) {
        return ClaimStatus.CCJ_AFTER_SETTLEMENT_BREACHED
      } else if (this.hasCCJByDeterminationBeenRequestedAfterSettlementBreached()) {
        return ClaimStatus.CCJ_BY_DETERMINATION_AFTER_SETTLEMENT_BREACHED
      } else {
        return ClaimStatus.CCJ_REQUESTED
      }
    } else if (this.isSettlementAgreementRejected()) {
      return ClaimStatus.SETTLEMENT_AGREEMENT_REJECTED
    } else if (this.isSettlementReachedThroughAdmission()) {
      return ClaimStatus.ADMISSION_SETTLEMENT_AGREEMENT_REACHED
    } else if (this.admissionPayImmediatelyPastPaymentDate && !this.claimantResponse) {
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
    } else if (this.hasClaimantAcceptedStatesPaid()) {
      return ClaimStatus.CLAIMANT_ACCEPTED_STATES_PAID
    } else if (this.hasClaimantRejectedStatesPaid()) {
      return ClaimStatus.CLAIMANT_REJECTED_STATES_PAID
    } else if (this.hasClaimantRejectedPartAdmission()) {
      return ClaimStatus.CLAIMANT_REJECTED_PART_ADMISSION
    } else if (this.hasClaimantRejectedDefendantResponse() && this.isDefendantBusiness()) {
      return ClaimStatus.CLAIMANT_REJECTED_DEFENDANT_AS_BUSINESS_RESPONSE
    } else if (this.hasClaimantAcceptedDefendantPartAdmissionResponseWithAlternativePaymentIntention() && this.isDefendantBusiness()) {
      return ClaimStatus.CLAIMANT_ACCEPTED_DEFENDANT_PART_ADMISSION_AS_BUSINESS_WITH_ALTERNATIVE_PAYMENT_INTENTION_RESPONSE
    } else if (this.hasClaimantAcceptedDefendantFullAdmissionResponseWithAlternativePaymentIntention() && this.isDefendantBusiness()) {
      return ClaimStatus.CLAIMANT_ACCEPTED_DEFENDANT_FULL_ADMISSION_AS_BUSINESS_WITH_ALTERNATIVE_PAYMENT_INTENTION_RESPONSE
    } else if (this.hasClaimantAcceptedPartAdmitPayImmediately()) {
      return ClaimStatus.PART_ADMIT_PAY_IMMEDIATELY
    } else if (this.isInterlocutoryJudgmentRequestedOnAdmissions()) {
      return ClaimStatus.REDETERMINATION_BY_JUDGE
    } else if (this.isClaimantResponseSubmitted()) {
      return ClaimStatus.CLAIMANT_RESPONSE_SUBMITTED
    } else if (this.moreTimeRequested) {
      return ClaimStatus.MORE_TIME_REQUESTED
    } else if (!this.response) {
      return ClaimStatus.NO_RESPONSE
    } else {
      throw new Error('Unknown Status')
    }
  }

  get stateHistory (): State[] {
    const statuses = [{ status: this.status }]
    if (this.isOfferRejected() && !this.isSettlementReached() && !this.settlement.isThroughAdmissions() && !this.moneyReceivedOn) {
      statuses.push({ status: ClaimStatus.OFFER_REJECTED })
    } else if (this.isOfferAccepted() && !this.isSettlementReached() && !this.settlement.isThroughAdmissions() && !this.moneyReceivedOn) {
      statuses.push({ status: ClaimStatus.OFFER_ACCEPTED })
    } else if (this.isOfferSubmitted() && !this.settlement.isThroughAdmissions() && !this.moneyReceivedOn) {
      statuses.push({ status: ClaimStatus.OFFER_SUBMITTED })
    }

    if (this.eligibleForCCJAfterBreachedSettlementTerms) {
      statuses.push({ status: ClaimStatus.ELIGIBLE_FOR_CCJ_AFTER_BREACHED_SETTLEMENT })
    }
    if (this.isPaidInFullLinkEligible()) {
      statuses.push({ status: ClaimStatus.PAID_IN_FULL_LINK_ELIGIBLE })
    }
    return statuses
  }

  get admissionPayImmediatelyPastPaymentDate (): boolean {
    return this.response && (this.response as FullAdmissionResponse).paymentIntention && (this.response as FullAdmissionResponse).paymentIntention.paymentOption === PaymentOption.IMMEDIATELY &&
      (this.response as FullAdmissionResponse).paymentIntention.paymentDate.isBefore(MomentFactory.currentDateTime())
  }

  get retrieveDateOfBirthOfDefendant (): DateOfBirth {
    if (this.response && this.response.defendant.type === PartyType.INDIVIDUAL.value) {
      const defendantDateOfBirth: Moment = MomentFactory.parse((this.response.defendant as Individual).dateOfBirth)
      return new DateOfBirth(true, LocalDate.fromMoment(defendantDateOfBirth))
    }
    return undefined
  }

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

  isAdmissionsResponse (): boolean {
    return (this.response.responseType === ResponseType.FULL_ADMISSION
      || this.response.responseType === ResponseType.PART_ADMISSION)
  }

  public isResponseSubmitted (): boolean {
    return !!this.response && !this.claimantResponse
  }

  hasDefendantNotSignedSettlementAgreementInTime (): boolean {
    return this.settlement && this.settlement.isOfferAccepted() && this.settlement.isThroughAdmissions() &&
      this.claimantRespondedAt && this.claimantRespondedAt.clone().add('7', 'days').isBefore(MomentFactory.currentDate())
  }

  hasClaimantAcceptedAdmissionWithCCJ (): boolean {
    return this.countyCourtJudgment && this.response && this.claimantResponse && !this.isSettlementReachedThroughAdmission() &&
      (this.response.responseType === ResponseType.FULL_ADMISSION || this.response.responseType === ResponseType.PART_ADMISSION) &&
      !(this.claimantResponse as AcceptationClaimantResponse).courtDetermination && !this.reDeterminationRequestedAt
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

  isEligibleForReDetermination (): boolean {
    const dateAfter19Days = this.countyCourtJudgmentRequestedAt && this.countyCourtJudgmentRequestedAt.clone().add(19, 'days')
    return this.countyCourtJudgment && this.countyCourtJudgment.ccjType === CountyCourtJudgmentType.DETERMINATION
      && MomentFactory.currentDateTime().isBefore(dateAfter19Days)
      && this.reDeterminationRequestedAt === undefined
  }

  public amountPaid () {
    return this.claimantResponse && this.claimantResponse.amountPaid ? this.claimantResponse.amountPaid : 0
  }

  public otherPartyName (user: User): string {
    if (!user || !user.id) {
      throw new Error('user must be provided')
    }

    return this.claimantId === user.id ? this.claimData.defendant.name : this.claimData.claimant.name
  }

  private isPaidInFullLinkEligible (): boolean {
    if (this.moneyReceivedOn || (this.moneyReceivedOn && this.countyCourtJudgmentRequestedAt)) {
      return false
    }

    if (this.isResponseSubmitted() && this.response.responseType === ResponseType.PART_ADMISSION && (this.response && !this.response.paymentDeclaration)) {
      return true
    }

    if (this.isResponseSubmitted() && (this.response.responseType === ResponseType.FULL_DEFENCE || this.response.responseType === ResponseType.PART_ADMISSION)) {
      return true
    }

    if (this.isOfferAccepted() || this.hasClaimantRejectedPartAdmission() || this.hasRedeterminationBeenRequested()) {
      return true
    }

    if (this.claimantResponse && (this.claimantResponse as AcceptationClaimantResponse).formaliseOption === FormaliseOption.REFER_TO_JUDGE) {
      return true
    }

    if (this.hasClaimantRespondedToStatesPaid()) {
      return false
    }

    return (((this.response && (this.response as FullAdmissionResponse).paymentIntention.paymentOption !== PaymentOption.IMMEDIATELY && !this.isSettlementReachedThroughAdmission()
      && this.isResponseSubmitted()) && !(this.countyCourtJudgmentRequestedAt && this.hasClaimantAcceptedAdmissionWithCCJ())) || !this.response)
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

  get isSettled (): boolean {
    return this.settlement && this.settlement.isSettled()
  }

  private isSettlementReached (): boolean {
    return this.settlement && !!this.settlementReachedAt
  }

  private isCCJPaidWithinMonth (): boolean {
    return this.moneyReceivedOn.isSameOrBefore(calculateMonthIncrement(this.countyCourtJudgmentRequestedAt))
  }

  isSettlementReachedThroughAdmission (): boolean {
    return this.settlement && this.settlement.isThroughAdmissionsAndSettled()
  }

  isSettlementAgreementRejected (): boolean {
    if (!this.claimantResponse || this.claimantResponse.type !== ClaimantResponseType.ACCEPTATION) {
      return false
    }
    const claimantResponse: AcceptationClaimantResponse = this.claimantResponse
    return claimantResponse.formaliseOption === FormaliseOption.SETTLEMENT
      && this.settlement && this.settlement.isOfferRejected()
  }

  private hasClaimantAcceptedOfferAndSignedSettlementAgreement (): boolean {
    return this.settlement && this.settlement.isOfferAccepted() && this.settlement.isThroughAdmissions() &&
      this.claimantResponse && !(this.claimantResponse as AcceptationClaimantResponse).courtDetermination
  }

  private hasClaimantSignedSettlementAgreementChosenByCourt (): boolean {
    return this.settlement && this.settlement.isOfferAccepted() && this.settlement.isThroughAdmissions() &&
      this.claimantResponse && !!(this.claimantResponse as AcceptationClaimantResponse).courtDetermination
  }

  private hasClaimantRejectedDefendantResponse (): boolean {
    return this.claimantResponse && this.claimantResponse.type === ClaimantResponseType.REJECTION
  }

  private hasClaimantAcceptedDefendantPartAdmissionResponseWithAlternativePaymentIntention (): boolean {
    return this.claimantResponse && this.claimantResponse.type === ClaimantResponseType.ACCEPTATION &&
      this.claimantResponse.claimantPaymentIntention &&
      this.response && this.response.responseType === ResponseType.PART_ADMISSION
  }

  private hasClaimantAcceptedDefendantFullAdmissionResponseWithAlternativePaymentIntention (): boolean {
    return this.claimantResponse && this.claimantResponse.type === ClaimantResponseType.ACCEPTATION &&
      this.claimantResponse.claimantPaymentIntention &&
      this.response && this.response.responseType === ResponseType.FULL_ADMISSION
  }

  private isClaimantResponseSubmitted (): boolean {
    return this.response !== undefined && this.claimantResponse !== undefined
  }

  private hasClaimantSuggestedAlternativePlanWithCCJ (): boolean {
    return this.claimantResponse && this.countyCourtJudgmentRequestedAt && !this.isSettlementReachedThroughAdmission() &&
      !!(this.claimantResponse as AcceptationClaimantResponse).courtDetermination && !this.reDeterminationRequestedAt
  }

  private hasRedeterminationBeenRequested (): boolean {
    return this.claimantResponse && this.countyCourtJudgmentRequestedAt && !!this.reDeterminationRequestedAt
  }

  private hasClaimantRejectedPartAdmission (): boolean {
    return this.claimantResponse && this.claimantResponse.type === ClaimantResponseType.REJECTION
      && this.response.responseType === ResponseType.PART_ADMISSION
  }

  private hasCCJBeenRequestedAfterSettlementBreached (): boolean {
    return this.isSettlementReachedThroughAdmission() && !!this.countyCourtJudgmentRequestedAt && !(this.claimantResponse as AcceptationClaimantResponse).courtDetermination
  }

  private hasCCJByDeterminationBeenRequestedAfterSettlementBreached (): boolean {
    return this.isSettlementReachedThroughAdmission() && !!this.countyCourtJudgmentRequestedAt && !!(this.claimantResponse as AcceptationClaimantResponse).courtDetermination
  }

  private hasClaimantAcceptedPartAdmitPayImmediately (): boolean {
    return this.claimantResponse && this.claimantResponse.type === ClaimantResponseType.ACCEPTATION &&
      this.response.responseType === ResponseType.PART_ADMISSION && !this.response.paymentDeclaration &&
      this.response.paymentIntention.paymentOption === PaymentOption.IMMEDIATELY
  }

  private hasClaimantAcceptedStatesPaid (): boolean {
    return this.hasClaimantRespondedToStatesPaid() && this.claimantResponse.type === ClaimantResponseType.ACCEPTATION
  }

  private hasClaimantRespondedToStatesPaid (): boolean {
    return !!this.claimantResponse && !!this.claimantResponse.type &&
      ((this.response.responseType === ResponseType.PART_ADMISSION && this.response.paymentDeclaration !== undefined)
        || (this.response.responseType === ResponseType.FULL_DEFENCE && this.response.defenceType === DefenceType.ALREADY_PAID && this.response.paymentDeclaration !== undefined))
  }

  private hasClaimantRejectedStatesPaid (): boolean {
    return this.claimantResponse
      && this.claimantResponse.type === ClaimantResponseType.REJECTION
      && ((this.response.responseType === ResponseType.FULL_DEFENCE && this.response.defenceType === DefenceType.ALREADY_PAID)
         || this.response.responseType === ResponseType.PART_ADMISSION)
      && this.response.paymentDeclaration !== undefined
  }

  isInterlocutoryJudgmentRequestedOnAdmissions (): boolean {
    return this.response
      && (this.response.responseType === ResponseType.FULL_ADMISSION
        || this.response.responseType === ResponseType.PART_ADMISSION)
      && this.claimantResponse
      && (this.claimantResponse as AcceptationClaimantResponse).formaliseOption === FormaliseOption.REFER_TO_JUDGE
  }
}
