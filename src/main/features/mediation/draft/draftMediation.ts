import { DraftDocument } from '@hmcts/cmc-draft-store-middleware'
import { FreeMediation } from 'forms/models/freeMediation'

export class DraftMediation extends DraftDocument {
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
    }
    return this
  }
}
