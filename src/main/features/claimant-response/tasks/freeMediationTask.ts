import { MediationDraft } from 'mediation/draft/mediationDraft'
import { FreeMediationTask } from 'shared/components/free-mediation/freeMediationTask'

export class ClaimantResponseFreeMediationTask extends FreeMediationTask {
  static isCompleted (mediationDraft: MediationDraft): boolean {
    return (this.isWillYouTryMediationCompleted(mediationDraft)) ||
      this.isYouCanOnlyUseMediationCompleted(mediationDraft) &&
      this.isCanWeUseCompleted(mediationDraft)
  }
}
