import { Validator } from '@hmcts/class-validator'

import { ResponseDraft } from 'response/draft/responseDraft'
import { MediationDraft } from 'mediation/draft/mediationDraft'
import { FeatureToggles } from 'utils/featureToggles'
import { FreeMediationOption } from 'forms/models/freeMediation'

const validator = new Validator()

export class FreeMediationTask {
  static isCompleted (responseDraft: ResponseDraft, mediationDraft: MediationDraft): boolean {
    if (FeatureToggles.isEnabled('mediation')) {
      return (this.isWillYouTryMediationCompleted(mediationDraft)) ||
        this.isYouCanOnlyUseMediationCompleted(mediationDraft) &&
        this.isCanWeUseCompleted(mediationDraft)
    } else {
      return responseDraft.freeMediation !== undefined && validator.validateSync(responseDraft.freeMediation).length === 0
    }
  }

  private static isWillYouTryMediationCompleted (mediationDraft: MediationDraft): boolean {
    return !!mediationDraft.willYouTryMediation && mediationDraft.willYouTryMediation.option === FreeMediationOption.NO
  }

  private static isYouCanOnlyUseMediationCompleted (mediationDraft: MediationDraft): boolean {
    return !!mediationDraft.willYouTryMediation && mediationDraft.willYouTryMediation.option === FreeMediationOption.YES &&
      !!mediationDraft.youCanOnlyUseMediation
  }

  private static isCanWeUseCompleted (mediationDraft: MediationDraft): boolean {
    return ((!mediationDraft.canWeUse && !mediationDraft.canWeUseCompany) ||
      (!!mediationDraft.canWeUse && mediationDraft.canWeUse.isCompleted()) ||
      (!!mediationDraft.canWeUseCompany && mediationDraft.canWeUseCompany.isCompleted()))
  }
}
