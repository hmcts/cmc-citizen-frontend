import { DraftDocument } from '@hmcts/cmc-draft-store-middleware'
import { FormaliseRepaymentPlan } from 'claimant-response/form/models/formaliseRepaymentPlan'

export class DraftClaimantResponse extends DraftDocument {

  formaliseRepaymentPlan?: FormaliseRepaymentPlan = new FormaliseRepaymentPlan()

  constructor () {
    super()
  }

  deserialize (input: any): DraftClaimantResponse {
    if (input) {
      this.externalId = input.externalId
      if (input.formaliseRepaymentPlan) {
        this.formaliseRepaymentPlan = input.formaliseRepaymentPlan
      }
    }
    return this
  }
}
