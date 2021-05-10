import { MediationDraft } from 'mediation/draft/mediationDraft'
import { FreeMediationOption } from 'forms/models/freeMediation'
import { Claim } from 'claims/models/claim'
import { FeatureToggles } from 'utils/featureToggles'
import { ClaimFeatureToggles } from 'utils/claimFeatureToggles'
import { LaunchDarklyClient } from 'shared/clients/launchDarklyClient'

export class FreeMediationTask {
  static isWillYouTryMediationCompleted (mediationDraft: MediationDraft): boolean {
    return (mediationDraft.willYouTryMediation && mediationDraft.willYouTryMediation.option === FreeMediationOption.NO) ||
      (!!mediationDraft.youCanOnlyUseMediation &&
        mediationDraft.willYouTryMediation && mediationDraft.willYouTryMediation.option === FreeMediationOption.YES)
  }

  static isEnhancedWillYouTryMediationCompleted (mediationDraft: MediationDraft): boolean {
    return !!mediationDraft.willYouTryMediation
  }

  static isYouCanOnlyUseMediationCompleted (mediationDraft: MediationDraft): boolean {
    return (mediationDraft.willYouTryMediation && mediationDraft.willYouTryMediation.option === FreeMediationOption.YES &&
      !!mediationDraft.youCanOnlyUseMediation)
  }

  static isEnhancedYouCanOnlyUseMediationCompleted (mediationDraft: MediationDraft): boolean {
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
    const featureToggles: FeatureToggles = new FeatureToggles(new LaunchDarklyClient())
    if (await featureToggles.isEnhancedMediationJourneyEnabled()) {
      return (this.isCanWeUseCompleted(mediationDraft) && this.isEnhancedYouCanOnlyUseMediationCompleted(mediationDraft)) ||
          (this.isEnhancedWillYouTryMediationCompleted(mediationDraft) && (this.isMediationDisagreementCompleted(mediationDraft)
          || this.isEnhancedYouCanOnlyUseMediationCompleted(mediationDraft)))
    } else {
      if (!FeatureToggles.isEnabled('mediation')) {
        return (!!mediationDraft.willYouTryMediation)
      } else if (ClaimFeatureToggles.isFeatureEnabledOnClaim(claim, 'mediationPilot')) {
        return (this.isCanWeUseCompleted(mediationDraft) && this.isYouCanOnlyUseMediationCompleted(mediationDraft)) ||
          (this.isWillYouTryMediationCompleted(mediationDraft) && (this.isMediationDisagreementCompleted(mediationDraft)
          || this.isYouCanOnlyUseMediationCompleted(mediationDraft)))
      } else {
        return (this.isYouCanOnlyUseMediationCompleted(mediationDraft)) || this.isWillYouTryMediationCompleted(mediationDraft)
      }
    }
  }
}
