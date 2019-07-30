import { MediationDraft } from 'mediation/draft/mediationDraft'
import { FreeMediationTask } from 'shared/components/free-mediation/freeMediationTask'
import { Claim } from 'claims/models/claim'
import { ClaimFeatureToggles } from 'utils/claimFeatureToggles'

export class ResponseFreeMediationTask extends FreeMediationTask {
  static isCompleted (mediationDraft: MediationDraft, claim: Claim): boolean {
    if (ClaimFeatureToggles.isFeatureEnabledOnClaim(claim, 'mediationPilot')) {
      return (this.isCanWeUseCompleted(mediationDraft) && this.isYouCanOnlyUseMediationCompleted(mediationDraft))
    } else {
      return (this.isYouCanOnlyUseMediationCompleted(mediationDraft)) || this.isWillYouTryMediationCompleted(mediationDraft)
    }
  }
}
