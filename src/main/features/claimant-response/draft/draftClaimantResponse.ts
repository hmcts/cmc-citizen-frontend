import { DraftDocument } from '@hmcts/cmc-draft-store-middleware'

export class DraftClaimantResponse extends DraftDocument {

  constructor () {
    super()
  }

  deserialize (input: any): DraftClaimantResponse {
    if (input) {
      this.externalId = input.externalId
    }
    return this
  }
}
