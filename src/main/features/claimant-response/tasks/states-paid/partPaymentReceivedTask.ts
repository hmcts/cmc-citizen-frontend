import { Validator } from 'class-validator'

import { YesNoOption } from 'models/yesNoOption'
import { DraftClaimantResponse } from 'claimant-response/draft/draftClaimantResponse'

const validator = new Validator()

export class PartPaymentReceivedTask {
  static isCompleted (value: DraftClaimantResponse): boolean {
    if (!value.partPaymentReceived || validator.validateSync(value.partPaymentReceived).length > 0) {
      return false
    }

    const isReasonNeeded: boolean = value.partPaymentReceived.received.option === YesNoOption.NO.option

    if (isReasonNeeded) {
      return value.rejectionReason !== undefined && validator.validateSync(value.rejectionReason).length === 0
    } else {
      return true
    }

  }
}
