import { Validator } from '@hmcts/class-validator'

import { MediationDraft } from 'mediation/draft/mediationDraft'
import { DraftClaimantResponse } from 'claimant-response/draft/draftClaimantResponse'
import { FreeMediationTask } from 'shared/components/free-mediation/freeMediationTask'

const validator = new Validator()

export class ClaimantResponseFreeMediationTask extends FreeMediationTask {
  static isCompleted (claimantResponseDraft: DraftClaimantResponse, mediationDraft: MediationDraft): boolean {
    return mediationDraft.willYouTryMediation !== undefined && validator.validateSync(mediationDraft.willYouTryMediation).length === 0
  }
}
