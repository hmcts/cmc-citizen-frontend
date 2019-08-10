import { DraftDocument } from '@hmcts/cmc-draft-store-middleware'
import { DisagreeReason } from 'orders/form/models/disagreeReason'

export class OrdersDraft extends DraftDocument {

  disagreeReason: DisagreeReason = new DisagreeReason()

  deserialize (input: any): OrdersDraft {
    if (input) {
      this.externalId = input.externalId
      this.disagreeReason = input.disagreeReason
    }
    return this
  }
}
