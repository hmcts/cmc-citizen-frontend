import { Validator } from 'class-validator'

import { DraftStatesPaidResponse } from 'claimant-response/draft/draftStatesPaidResponse'
import { YesNoOption } from 'models/yesNoOption'

const validator = new Validator()

export class PartPaymentReceivedTask {
  static isCompleted (value: DraftStatesPaidResponse): boolean {
    if (!value.partPaymentReceived || validator.validateSync(value.partPaymentReceived).length > 0) {
      return false
    }

    const isReasonNeeded: boolean = value.partPaymentReceived.received.option === YesNoOption.NO.option

    if (isReasonNeeded) {
      return value.disputeReason !== undefined && validator.validateSync(value.disputeReason).length === 0
    } else {
      return true
    }

  }
}
