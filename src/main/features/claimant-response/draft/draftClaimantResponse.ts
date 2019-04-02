import { DraftDocument } from '@hmcts/cmc-draft-store-middleware'
import { SettleAdmitted } from 'claimant-response/form/models/settleAdmitted'
import { AcceptPaymentMethod } from 'claimant-response/form/models/acceptPaymentMethod'
import { FormaliseRepaymentPlan } from 'claimant-response/form/models/formaliseRepaymentPlan'
import { SettlementAgreement } from 'claimant-response/form/models/settlementAgreement'
import { PaymentIntention as DraftPaymentIntention } from 'shared/components/payment-intention/model/paymentIntention'
import { FreeMediation } from 'forms/models/freeMediation'
import { PaidAmount } from 'ccj/form/models/paidAmount'
import { PartPaymentReceived } from 'claimant-response/form/models/states-paid/partPaymentReceived'
import { ClaimSettled } from 'claimant-response/form/models/states-paid/claimSettled'
import { AcceptCourtOffer } from 'claimant-response/form/models/acceptCourtOffer'
import { CourtDetermination } from 'claimant-response/draft/courtDetermination'
import { RejectionReason } from 'claimant-response/form/models/rejectionReason'
import { IntentionToProceed } from 'claimant-response/form/models/intentionToProceed'

export class DraftClaimantResponse extends DraftDocument {
  defendantResponseViewed: boolean
  courtOrderAmount: number

  settleAdmitted?: SettleAdmitted
  acceptPaymentMethod?: AcceptPaymentMethod
  formaliseRepaymentPlan?: FormaliseRepaymentPlan
  settlementAgreement?: SettlementAgreement
  alternatePaymentMethod?: DraftPaymentIntention
  freeMediation?: FreeMediation
  paidAmount?: PaidAmount
  partPaymentReceived?: PartPaymentReceived
  accepted?: ClaimSettled
  acceptCourtOffer?: AcceptCourtOffer
  courtDetermination?: CourtDetermination
  rejectionReason?: RejectionReason
  intentionToProceed?: IntentionToProceed

  constructor () {
    super()
  }

  deserialize (input: any): DraftClaimantResponse {
    if (input) {
      this.externalId = input.externalId
      if (input.defendantResponseViewed) {
        this.defendantResponseViewed = input.defendantResponseViewed
      }
      if (input.settleAdmitted) {
        this.settleAdmitted = new SettleAdmitted().deserialize(input.settleAdmitted)
      }
      if (input.acceptPaymentMethod) {
        this.acceptPaymentMethod = new AcceptPaymentMethod().deserialize(input.acceptPaymentMethod)
      }
      if (input.formaliseRepaymentPlan) {
        this.formaliseRepaymentPlan = new FormaliseRepaymentPlan().deserialize(input.formaliseRepaymentPlan)
      }
      if (input.settlementAgreement) {
        this.settlementAgreement = new SettlementAgreement().deserialize(input.settlementAgreement)
      }
      if (input.freeMediation) {
        this.freeMediation = new FreeMediation(input.freeMediation.option)
      }
      if (input.paidAmount) {
        this.paidAmount = new PaidAmount().deserialize(input.paidAmount)
      }
      if (input.partPaymentReceived) {
        this.partPaymentReceived = new PartPaymentReceived().deserialize(input.partPaymentReceived)
      }
      if (input.accepted) {
        this.accepted = new ClaimSettled().deserialize(input.accepted)
      }
      if (input.acceptCourtOffer) {
        this.acceptCourtOffer = new AcceptCourtOffer().deserialize(input.acceptCourtOffer)
      }
      if (input.alternatePaymentMethod) {
        this.alternatePaymentMethod = DraftPaymentIntention.deserialize(input.alternatePaymentMethod)
      }
      if (input.courtOrderAmount) {
        this.courtOrderAmount = input.courtOrderAmount
      }
      if (input.courtDetermination) {
        this.courtDetermination = new CourtDetermination().deserialize(input.courtDetermination)
      }
      if (input.rejectionReason) {
        this.rejectionReason = new RejectionReason().deserialize(input.rejectionReason)
      }
      if (input.intentionToProceed) {
        this.intentionToProceed = new IntentionToProceed().deserialize(input.intentionToProceed)
      }
    }
    return this
  }
}
