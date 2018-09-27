import { Validator } from 'class-validator'
import { DraftClaimantResponse } from 'claimant-response/draft/draftClaimantResponse'

const validator = new Validator()

export class PartPaymentReceivedTask {
  static isCompleted (value: DraftClaimantResponse): boolean {
    return value.partPaymentReceived && validator.validateSync(value.partPaymentReceived).length === 0
  }
}
