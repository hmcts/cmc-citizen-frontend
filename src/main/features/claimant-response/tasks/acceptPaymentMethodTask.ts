import { Validator } from '@hmcts/class-validator'

import { AcceptPaymentMethod } from 'claimant-response/form/models/acceptPaymentMethod'

const validator = new Validator()

export class AcceptPaymentMethodTask {
  static isCompleted (value: AcceptPaymentMethod): boolean {
    return value !== undefined && validator.validateSync(value).length === 0
  }
}
