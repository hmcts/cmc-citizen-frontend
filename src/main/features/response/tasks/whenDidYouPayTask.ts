import { ResponseDraft } from 'response/draft/responseDraft'
import { Validator } from 'class-validator'

const validator = new Validator()

export class WhenDidYouPayTask {
  static isCompleted (responseDraft: ResponseDraft): boolean {
    return responseDraft.whenDidYouPay !== undefined
      && validator.validateSync(responseDraft.whenDidYouPay).length === 0
  }
}
