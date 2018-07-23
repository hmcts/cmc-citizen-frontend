import { DraftDocument } from '@hmcts/cmc-draft-store-middleware'
import { FormaliseRepaymentPlan } from 'claimant-response/form/models/formaliseRepaymentPlan'
import { SettlementAgreement } from 'claimant-response/form/models/settlementAgreement'

export class DraftClaimantResponse extends DraftDocument {

  formaliseRepaymentPlan?: FormaliseRepaymentPlan = new FormaliseRepaymentPlan()
  settlementAgreement?: SettlementAgreement = new SettlementAgreement()

  constructor () {
    super()
  }

  deserialize (input: any): DraftClaimantResponse {
    if (input) {
      this.externalId = input.externalId
      if (input.formaliseRepaymentPlan) {
        this.formaliseRepaymentPlan = input.formaliseRepaymentPlan
      }
      if (input.settlementAgreement) {
        this.settlementAgreement = input.settlementAgreement
      }
    }
    return this
  }
}
