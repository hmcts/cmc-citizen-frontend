import { MediationDraft } from 'mediation/draft/mediationDraft'
import { FreeMediationOption } from 'forms/models/freeMediation'
import { Claim } from 'claims/models/claim'

export class FreeMediationTask {
  static isWillYouTryMediationCompleted (mediationDraft: MediationDraft): boolean {
    return !!mediationDraft.willYouTryMediation
  }

  static isYouCanOnlyUseMediationCompleted (mediationDraft: MediationDraft): boolean {
    return (mediationDraft.willYouTryMediation && mediationDraft.willYouTryMediation.option === FreeMediationOption.YES)
  }

  static isMediationDisagreementCompleted (mediationDraft: MediationDraft): boolean {
    return !!mediationDraft.mediationDisagreement
  }

  static isCanWeUseCompleted (mediationDraft: MediationDraft): boolean {
    return ((!!mediationDraft.canWeUse && !!mediationDraft.canWeUseCompany) ||
      (!!mediationDraft.canWeUse && mediationDraft.canWeUse.isCompleted()) ||
      (!!mediationDraft.canWeUseCompany && mediationDraft.canWeUseCompany.isCompleted()))
  }

  static async isCompleted (mediationDraft: MediationDraft, claim: Claim): Promise<boolean> {
    return (this.isCanWeUseCompleted(mediationDraft) && this.isYouCanOnlyUseMediationCompleted(mediationDraft)) ||
      (this.isWillYouTryMediationCompleted(mediationDraft) && (this.isMediationDisagreementCompleted(mediationDraft)
      || this.isYouCanOnlyUseMediationCompleted(mediationDraft)))
  }
}
