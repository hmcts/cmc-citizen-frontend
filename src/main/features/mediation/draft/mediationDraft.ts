import { DraftDocument } from '@hmcts/cmc-draft-store-middleware'
import { FreeMediation } from 'forms/models/freeMediation'
import { CanWeUse } from 'mediation/form/models/CanWeUse'

export class MediationDraft extends DraftDocument {
  canWeUse: CanWeUse
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
      if (input.canWeUse) {
        this.canWeUse = new CanWeUse().deserialize(input.canWeUse)
      }
    }
    return this
  }
}
