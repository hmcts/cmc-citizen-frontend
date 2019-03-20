import { DraftDocument } from '@hmcts/cmc-draft-store-middleware'

export class DirectionsQuestionnaireDraft extends DraftDocument {

  constructor () {
    super()
  }

  deserialize (input: any): DirectionsQuestionnaireDraft {
    if (input) {
      this.externalId = input.externalId
    }
    return this
  }
}
