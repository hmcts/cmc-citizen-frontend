import { Validator } from '@hmcts/class-validator'
import { IntentionToProceed } from 'claimant-response/form/models/intentionToProceed'

const validator = new Validator()

export class IntentionToProceedTask {
  static isCompleted (value: IntentionToProceed): boolean {
    return value !== undefined && validator.validateSync(value).length === 0
  }
}
