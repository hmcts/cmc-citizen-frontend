import { Validator } from 'class-validator'

import { ResponseDraft } from 'response/draft/responseDraft'

const validator = new Validator()

export class WhenWillYouPayTask {
  static isCompleted (responseDraft: ResponseDraft): boolean {
    return responseDraft.defendantPaymentOption !== undefined
      && validator.validateSync(responseDraft.defendantPaymentOption).length === 0
  }
}
