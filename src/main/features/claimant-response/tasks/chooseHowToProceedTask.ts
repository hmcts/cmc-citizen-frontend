import { Validator } from '@hmcts/class-validator'
import { FormaliseRepaymentPlan } from 'claimant-response/form/models/formaliseRepaymentPlan'

const validator = new Validator()

export class ChooseHowToProceedTask {
  static isCompleted (value: FormaliseRepaymentPlan): boolean {
    return value !== undefined && validator.validateSync(value).length === 0
  }
}
