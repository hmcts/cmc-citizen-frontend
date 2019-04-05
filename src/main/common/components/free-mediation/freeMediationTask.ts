import { MediationDraft } from 'mediation/draft/mediationDraft'
import { FreeMediationOption } from 'forms/models/freeMediation'

export class FreeMediationTask {
  static isWillYouTryMediationCompleted (mediationDraft: MediationDraft): boolean {
    return !!mediationDraft.willYouTryMediation && mediationDraft.willYouTryMediation.option === FreeMediationOption.NO
  }

  static isYouCanOnlyUseMediationCompleted (mediationDraft: MediationDraft): boolean {
    return !!mediationDraft.willYouTryMediation && mediationDraft.willYouTryMediation.option === FreeMediationOption.YES &&
      !!mediationDraft.youCanOnlyUseMediation
  }

  static isCanWeUseCompleted (mediationDraft: MediationDraft): boolean {
    return ((!mediationDraft.canWeUse && !mediationDraft.canWeUseCompany) ||
      (!!mediationDraft.canWeUse && mediationDraft.canWeUse.isCompleted()) ||
      (!!mediationDraft.canWeUseCompany && mediationDraft.canWeUseCompany.isCompleted()))
  }
}
