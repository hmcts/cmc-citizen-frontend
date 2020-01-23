import { Validator } from '@hmcts/class-validator'
import { DraftClaimantResponse } from 'claimant-response/draft/draftClaimantResponse'

const validator = new Validator()

export class PartPaymentReceivedTask {
  static isCompleted (value: DraftClaimantResponse): boolean {
    if (!value.partPaymentReceived) {
      return false
    }

    return validator.validateSync(value.partPaymentReceived).length === 0
  }
}
