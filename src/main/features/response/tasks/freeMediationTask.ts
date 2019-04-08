import { MediationDraft } from 'mediation/draft/mediationDraft'
import { FreeMediationTask } from 'shared/components/free-mediation/freeMediationTask'

export class ResponseFreeMediationTask extends FreeMediationTask {
  static isCompleted (mediationDraft: MediationDraft): boolean {
    return (this.isCanWeUseCompleted(mediationDraft) && this.isYouCanOnlyUseMediationCompleted(mediationDraft)) ||
      (this.isYouCanOnlyUseMediationCompleted(mediationDraft)) ||
      this.isWillYouTryMediationCompleted(mediationDraft)
  }
}
