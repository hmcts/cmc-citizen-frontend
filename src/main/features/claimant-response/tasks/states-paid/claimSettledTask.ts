import { Validator } from '@hmcts/class-validator'

import { YesNoOption } from 'models/yesNoOption'
import { DraftClaimantResponse } from 'claimant-response/draft/draftClaimantResponse'

const validator = new Validator()

export class ClaimSettledTask {
  static isCompleted (value: DraftClaimantResponse): boolean {
    if (!value.accepted || validator.validateSync(value.accepted).length > 0) {
      return false
    }

    const isReasonNeeded: boolean = value.accepted.accepted.option === YesNoOption.NO.option

    if (isReasonNeeded) {
      return value.rejectionReason !== undefined && validator.validateSync(value.rejectionReason).length === 0
    } else {
      return true
    }

  }
}
