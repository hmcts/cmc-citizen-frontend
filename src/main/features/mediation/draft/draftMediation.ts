import { DraftDocument } from '@hmcts/cmc-draft-store-middleware'

export class DraftMediation extends DraftDocument {

  constructor () {
    super()
  }

  deserialize (input: any): DraftMediation {
    if (input) {
      this.externalId = input.externalId

    }
    return this
  }
}
