import { DraftDocument } from '@hmcts/cmc-draft-store-middleware'
import { FreeMediation } from 'forms/models/freeMediation'
import { CanWeUse } from 'mediation/form/models/CanWeUse'

export class DraftMediation extends DraftDocument {
  canWeUse: CanWeUse
  willYouTryMediation: FreeMediation

  constructor () {
    super()
  }

  deserialize (input: any): DraftMediation {
    if (input) {
      this.externalId = input.externalId

      if (input.willYouTryMediation) {
        this.willYouTryMediation = new FreeMediation(input.willYouTryMediation.option)
      }
      if (input.canWeUse) {
        this.canWeUse = new CanWeUse().deserialize(input.canWeUse)
      }
    }
    return this
  }
}
