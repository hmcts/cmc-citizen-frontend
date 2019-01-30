import { ResponseDraft } from 'response/draft/responseDraft'
import { Validator } from 'class-validator'
import { HowMuchDoYouOwe } from 'response/form/models/howMuchDoYouOwe'
import { YesNoOption } from 'models/yesNoOption'

const validator = new Validator()

function isValid (model: HowMuchDoYouOwe): boolean {
  return !!model && validator.validateSync(model).length === 0
}

export class WhenWillYouPayTask {
  static isCompleted (responseDraft: ResponseDraft): boolean {
    return responseDraft.partialAdmission.alreadyPaid.option === YesNoOption.NO
      && responseDraft.partialAdmission.paymentIntention !== undefined
      && isValid(responseDraft.partialAdmission.paymentIntention.paymentOption)
  }
}
