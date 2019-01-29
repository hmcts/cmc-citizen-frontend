import { Validator } from 'class-validator'

import { FeatureToggles } from 'utils/featureToggles'
import { MediationDraft } from 'mediation/draft/mediationDraft'
import { DraftClaimantResponse } from 'claimant-response/draft/draftClaimantResponse'

const validator = new Validator()

export class FreeMediationTask {
  static isCompleted (claimantResponseDraft: DraftClaimantResponse, mediationDraft: MediationDraft): boolean {
    if (FeatureToggles.isEnabled('mediation')) {
      return mediationDraft.willYouTryMediation !== undefined && validator.validateSync(mediationDraft.willYouTryMediation).length === 0
    } else {
      return claimantResponseDraft.freeMediation !== undefined && validator.validateSync(claimantResponseDraft.freeMediation).length === 0
    }
  }
}
