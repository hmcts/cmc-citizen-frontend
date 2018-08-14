import { DraftDocument } from '@hmcts/cmc-draft-store-middleware'
import { SettleAdmitted } from 'claimant-response/form/models/settleAdmitted'
import { AcceptPaymentMethod } from 'claimant-response/form/models/acceptPaymentMethod'
import { FormaliseRepaymentPlan } from 'claimant-response/form/models/formaliseRepaymentPlan'
import { SettlementAgreement } from 'claimant-response/form/models/settlementAgreement'
import { RejectionReason } from 'claimant-response/form/models/rejectionReason'
import { AcceptCourtOffer } from 'claimant-response/form/models/acceptCourtOffer'

export class DraftClaimantResponse extends DraftDocument {
  defendantResponseViewed: boolean

  settleAdmitted?: SettleAdmitted
  acceptPaymentMethod?: AcceptPaymentMethod
  formaliseRepaymentPlan?: FormaliseRepaymentPlan
  settlementAgreement?: SettlementAgreement
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
      if (input.rejectionReason) {
        this.rejectionReason = new RejectionReason().deserialize(input.rejectionReason)
      }
      if (input.acceptCourtOffer) {
        this.acceptCourtOffer = new AcceptCourtOffer().deserialize(input.acceptCourtOffer)
      }
    }
    return this
  }
}
