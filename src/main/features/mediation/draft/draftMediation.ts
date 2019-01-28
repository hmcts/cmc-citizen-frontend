import { DraftDocument } from '@hmcts/cmc-draft-store-middleware'
import { CanWeUse } from 'mediation/form/models/CanWeUse'

export class DraftMediation extends DraftDocument {
  canWeUse: CanWeUse

  constructor () {
    super()
  }

  deserialize (input: any): DraftMediation {
    if (input) {
      this.externalId = input.externalId

      if (input.canWeUse) {
        this.canWeUse = new CanWeUse().deserialize(input.canWeUse)
      }

    }
    return this
  }
}
