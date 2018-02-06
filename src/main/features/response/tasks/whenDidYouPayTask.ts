import { ResponseDraft } from 'response/draft/responseDraft'
import { Validator } from 'class-validator'

const validator = new Validator()

export class WhenDidYouPayTask {
  static isCompleted (responseDraft: ResponseDraft): boolean {
    return (responseDraft.whenDidYouPay.text && responseDraft.whenDidYouPay.date.year
      && validator.validateSync(responseDraft.whenDidYouPay.date.year).length > 0)
  }
}
