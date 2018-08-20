import { ResponseDraft } from 'response/draft/responseDraft'
import { Validator } from 'class-validator'
import { HowMuchHaveYouPaid } from 'response/form/models/howMuchHaveYouPaid'

const validator = new Validator()

export class HowMuchHaveYouPaidTask {
  static isCompleted (responseDraft: ResponseDraft): boolean {
    if (responseDraft.isResponsePartiallyAdmitted()) {
      return HowMuchHaveYouPaidTask.isHowMuchHaveYouPaidValid(responseDraft.partialAdmission.howMuchHaveYouPaid)
    }
    if (responseDraft.isResponseRejectedFullyBecausePaidWhatOwed()) {
      return HowMuchHaveYouPaidTask.isHowMuchHaveYouPaidValid(responseDraft.rejectAllOfClaim.howMuchHaveYouPaid)
    }
    return false
  }

  private static isHowMuchHaveYouPaidValid (model: HowMuchHaveYouPaid): boolean {
    return !!model && validator.validateSync(model).length === 0
  }
}
