import { Validator } from '@hmcts/class-validator'

import { SettleAdmitted } from 'claimant-response/form/models/settleAdmitted'

const validator = new Validator()

export class SettleAdmittedTask {
  static isCompleted (value: SettleAdmitted): boolean {
    return value !== undefined && validator.validateSync(value).length === 0
  }
}
