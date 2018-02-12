import { ResponseDraft } from 'response/draft/responseDraft'
import { Validator } from 'class-validator'

const validator = new Validator()

function isValid (input): boolean {
  return input !== undefined && validator.validateSync(input).length === 0
}

export class WhenDidYouPayTask {
  static isCompleted (responseDraft: ResponseDraft): boolean {
    return responseDraft.whenDidYouPay !== undefined
    && isValid(responseDraft.whenDidYouPay.date)
    && isValid(responseDraft.whenDidYouPay)
  }
}
