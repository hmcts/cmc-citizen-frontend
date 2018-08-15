import { ResponseDraft } from 'response/draft/responseDraft'
import { Validator } from 'class-validator'
import { Defence } from 'response/form/models/defence'

const validator = new Validator()

export class WhyDoYouDisagreeTask {
  static isCompleted (responseDraft: ResponseDraft): boolean {
    if (responseDraft.isResponsePartiallyAdmitted()) {
      return WhyDoYouDisagreeTask.isWhyDoYouDisagreeValid(responseDraft.partialAdmission.whyDoYouDisagree)
    }
    if (responseDraft.isResponseRejectedFullyBecausePaidInFull()) {
      return WhyDoYouDisagreeTask.isWhyDoYouDisagreeValid(responseDraft.rejectAllOfClaim.whyDoYouDisagree)
    }
  }

  private static isWhyDoYouDisagreeValid (model: Defence): boolean {
    return !!model && validator.validateSync(model).length === 0
  }
}
