import { Validator } from 'class-validator'

import { DraftStatesPaidResponse } from 'claimant-response/draft/draftStatesPaidResponse'
import { YesNoOption } from 'models/yesNoOption'

const validator = new Validator()

export class ClaimSettledTask {
  static isCompleted (value: DraftStatesPaidResponse): boolean {
    if (!value.accepted || validator.validateSync(value.accepted).length > 0) {
      return false
    }

    const isReasonNeeded: boolean = value.accepted.accepted.option === YesNoOption.NO.option

    if (isReasonNeeded) {
      return value.disputeReason !== undefined && validator.validateSync(value.disputeReason).length === 0
    } else {
      return true
    }

  }
}
