import { DraftDocument } from '@hmcts/cmc-draft-store-middleware'

export class DraftClaimantResponse extends DraftDocument {

  viewedDefendantResponse: boolean = false

  constructor () {
    super()
  }

  deserialize (input: any): DraftClaimantResponse {
    if (input) {
      this.externalId = input.externalId
      this.viewedDefendantResponse = input.viewedDefendantResponse
    }
    return this
  }
}
