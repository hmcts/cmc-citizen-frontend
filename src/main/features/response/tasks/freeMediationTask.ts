import { Validator } from 'class-validator'

import { ResponseDraft } from 'response/draft/responseDraft'
import { MediationDraft } from 'mediation/draft/mediationDraft'
import { FeatureToggles } from 'utils/featureToggles'
import { FreeMediationOption } from 'forms/models/freeMediation'

const validator = new Validator()

export class FreeMediationTask {
  static isCompleted (responseDraft: ResponseDraft, mediationDraft: MediationDraft): boolean {
    if (FeatureToggles.isEnabled('mediation')) {
      return (!!mediationDraft.willYouTryMediation && mediationDraft.willYouTryMediation.option === FreeMediationOption.NO) ||
        !!mediationDraft.willYouTryMediation && mediationDraft.willYouTryMediation.option === FreeMediationOption.YES &&
        !!mediationDraft.youCanOnlyUseMediation &&
        (mediationDraft.youCanOnlyUseMediation.option === FreeMediationOption.YES ||
          mediationDraft.youCanOnlyUseMediation.option === FreeMediationOption.NO)
    } else {
      return responseDraft.freeMediation !== undefined && validator.validateSync(responseDraft.freeMediation).length === 0
    }
  }
}
