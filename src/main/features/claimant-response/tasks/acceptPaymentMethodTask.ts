import { Validator } from 'class-validator'

import { DraftClaimantResponse } from 'claimant-response/draft/draftClaimantResponse'

const validator = new Validator()

export class AcceptPaymentMethodTask {
  static isCompleted (draftClaimantResponse: DraftClaimantResponse): boolean {
    return draftClaimantResponse.acceptPaymentMethod !== undefined && validator.validateSync(draftClaimantResponse.acceptPaymentMethod).length === 0
  }
}
