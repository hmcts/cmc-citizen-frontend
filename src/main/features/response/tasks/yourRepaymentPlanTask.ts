import { Validator } from 'class-validator'
import { ResponseDraft } from 'response/draft/responseDraft'

const validator = new Validator()

function isValid (input): boolean {
  return input !== undefined && validator.validateSync(input).length === 0
}

export class YourRepaymentPlanTask {
  static isCompleted (responseDraft: ResponseDraft): boolean {
    return isValid(responseDraft.fullAdmission.paymentPlan)
  }
}
