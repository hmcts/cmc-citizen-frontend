import { DraftDocument } from '@hmcts/cmc-draft-store-middleware'
import { FreeMediation } from 'forms/models/freeMediation'

export class MediationDraft extends DraftDocument {
  willYouOptOutOfMediation: FreeMediation
  youCanOnlyUseMediation: FreeMediation

  constructor () {
    super()
  }

  deserialize (input: any): MediationDraft {
    if (input) {
      this.externalId = input.externalId

      if (input.willYouOptOutOfMediation) {
        this.willYouOptOutOfMediation = new FreeMediation(input.willYouOptOutOfMediation.option)
      }
      if (input.youCanOnlyUseMediation) {
        this.youCanOnlyUseMediation = new FreeMediation(input.youCanOnlyUseMediation.option)
      }
    }
    return this
  }
}
