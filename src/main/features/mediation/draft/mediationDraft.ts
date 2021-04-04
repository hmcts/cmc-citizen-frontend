import { DraftDocument } from '@hmcts/cmc-draft-store-middleware'
import { FreeMediation } from 'forms/models/freeMediation'
import { CanWeUse } from 'mediation/form/models/CanWeUse'
import { CanWeUseCompany } from 'mediation/form/models/CanWeUseCompany'

export class MediationDraft extends DraftDocument {
  canWeUse: CanWeUse
  canWeUseCompany: CanWeUseCompany
  willYouTryMediation: FreeMediation
  youCanOnlyUseMediation: FreeMediation
  mediationDisagreement: FreeMediation
  noMediationReason: FreeMediation

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
      if (input.canWeUseCompany) {
        this.canWeUseCompany = new CanWeUseCompany().deserialize(input.canWeUseCompany)
      }
      if (input.mediationDisagreement) {
        this.mediationDisagreement = new FreeMediation(input.mediationDisagreement.option)
      }
      if (input.noMediationReason) {
        this.noMediationReason = new FreeMediation(input.noMediationReason.option)
      }
    }
    return this
  }
}
