import { DraftDocument } from '@hmcts/cmc-draft-store-middleware'
import { SettleAdmitted } from 'claimant-response/form/models/settleAdmitted'
import { AcceptPaymentMethod } from 'claimant-response/form/models/acceptPaymentMethod'

export class DraftClaimantResponse extends DraftDocument {
  defendantResponseViewed: boolean

  settleAdmitted?: SettleAdmitted
  acceptPaymentMethod?: AcceptPaymentMethod

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
    }
    return this
  }
}
