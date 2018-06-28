import { ResponseDraft } from 'response/draft/responseDraft'
import { Validator } from 'class-validator'
import { HowMuchHaveYouPaid } from 'response/form/models/howMuchHaveYouPaid'

const validator = new Validator()

export class HowMuchHaveYouPaidTask {
  static isCompleted (responseDraft: ResponseDraft): boolean {
    return responseDraft.isResponsePartiallyAdmitted()
      && HowMuchHaveYouPaidTask.isHowMuchHaveYouPaidValid(responseDraft.partialAdmission.howMuchDidYouPaid)
  }

  private static isHowMuchHaveYouPaidValid (model: HowMuchHaveYouPaid): boolean {
    return !!model && validator.validateSync(model).length === 0
  }
}
