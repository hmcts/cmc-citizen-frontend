import { RejectionReason } from 'claimant-response/form/models/rejectionReason'
import { Validator } from '@hmcts/class-validator'

const validator = new Validator()

export class RejectionReasonTask {
  static isCompleted (value: RejectionReason): boolean {
    return value !== undefined && validator.validateSync(value).length === 0
  }
}
