import { Validator } from '@hmcts/class-validator'

import { FreeMediation } from 'forms/models/freeMediation'

const validator = new Validator()

export class FreeMediationTask {
  static isCompleted (value: FreeMediation): boolean {
    return value !== undefined && validator.validateSync(value).length === 0
  }
}
