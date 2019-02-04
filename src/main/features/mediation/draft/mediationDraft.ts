import { DraftDocument } from '@hmcts/cmc-draft-store-middleware'
import { FreeMediation } from 'forms/models/freeMediation'

export class MediationDraft extends DraftDocument {
  willYouTryMediation: FreeMediation
  youCanOnlyUseMediation: FreeMediation

  constructor () {
    super()
  }

  deserialize (input: any): MediationDraft {
    if (input) {
      this.externalId = input.externalId

      if (input.willYouTryMediation) {
        this.willYouTryMediation = new FreeMediation(input.willYouTryMediation.option)
      }
      if (input.youCanOnlyUseMediation) {
        this.youCanOnlyUseMediation = new FreeMediation(input.youCanOnlyUseMediation.option)
      }
    }
    return this
  }
}
