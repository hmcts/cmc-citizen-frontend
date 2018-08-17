import { Validator } from 'class-validator'

import { FreeMediation } from 'response/form/models/freeMediation'

const validator = new Validator()

export class FreeMediationTask {
  static isCompleted (value: FreeMediation): boolean {
    return value !== undefined && validator.validateSync(value).length === 0
  }
}
