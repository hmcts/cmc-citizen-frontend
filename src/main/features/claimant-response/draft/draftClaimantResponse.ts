import { DraftDocument } from '@hmcts/cmc-draft-store-middleware'
import { FormaliseRepaymentPlan } from 'claimant-response/form/models/formaliseRepaymentPlan'

export class DraftClaimantResponse extends DraftDocument {

  formaliseRepaymentPlan?: FormaliseRepaymentPlan

  constructor () {
    super()
  }

  deserialize (input: any): DraftClaimantResponse {
    if (input) {
      this.externalId = input.externalId
      if (input.chooseHowToRespond) {
        this.formaliseRepaymentPlan = input.formaliseRepaymentPlan
      }
    }
    return this
  }
}
