import { DraftDocument } from '@hmcts/cmc-draft-store-middleware'
import { SettleAdmitted } from 'claimant-response/form/models/settleAdmitted'
import { AcceptPaymentMethod } from 'claimant-response/form/models/acceptPaymentMethod'
import { FormaliseRepaymentPlan } from 'claimant-response/form/models/formaliseRepaymentPlan'
import { SettlementAgreement } from 'claimant-response/form/models/settlementAgreement'
import { PaymentIntention } from 'shared/components/payment-intention/model/paymentIntention'
import { FreeMediation } from 'response/form/models/freeMediation'
import { PaidAmount } from 'ccj/form/models/paidAmount'
import { RejectionReason } from 'claimant-response/form/models/rejectionReason'
import { AcceptCourtOffer } from 'claimant-response/form/models/acceptCourtOffer'

export class DraftClaimantResponse extends DraftDocument {
  defendantResponseViewed: boolean
  courtOrderAmount: number

  settleAdmitted?: SettleAdmitted
  acceptPaymentMethod?: AcceptPaymentMethod
  formaliseRepaymentPlan?: FormaliseRepaymentPlan
  settlementAgreement?: SettlementAgreement
  alternatePaymentMethod?: PaymentIntention
  courtOfferedPaymentIntention?: PaymentIntention
  freeMediation?: FreeMediation
  paidAmount?: PaidAmount
  rejectionReason?: RejectionReason
  acceptCourtOffer?: AcceptCourtOffer

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
      if (input.rejectionReason) {
        this.rejectionReason = new RejectionReason().deserialize(input.rejectionReason)
      }
      if (input.acceptCourtOffer) {
        this.acceptCourtOffer = new AcceptCourtOffer().deserialize(input.acceptCourtOffer)
      }
      if (input.alternatePaymentMethod) {
        this.alternatePaymentMethod = PaymentIntention.deserialise(input.alternatePaymentMethod)
      }
      if (input.courtOfferedPaymentIntention) {
        this.courtOfferedPaymentIntention = PaymentIntention.deserialise(input.courtOfferedPaymentIntention)
      }
      if (input.courtOrderAmount) {
        this.courtOrderAmount = input.courtOrderAmount
      }
    }
    return this
  }
}
