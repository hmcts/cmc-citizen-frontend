import { Validator } from 'class-validator'

import { DraftClaimantResponse } from 'claimant-response/draft/draftClaimantResponse'

const validator = new Validator()

export class SettleAdmittedTask {
  static isCompleted (draftClaimantResponse: DraftClaimantResponse): boolean {
    return draftClaimantResponse.settleAdmitted !== undefined && validator.validateSync(draftClaimantResponse.settleAdmitted).length === 0
  }
}
