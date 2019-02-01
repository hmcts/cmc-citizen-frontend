import { ResponseDraft } from 'response/draft/responseDraft'
import { Validator } from '@hmcts/class-validator'
import { HowMuchDoYouOwe } from 'response/form/models/howMuchDoYouOwe'
import { YesNoOption } from 'models/yesNoOption'

const validator = new Validator()

export class HowMuchDoYouOweTask {
  static isCompleted (responseDraft: ResponseDraft): boolean {
    return responseDraft.partialAdmission.alreadyPaid.option === YesNoOption.NO
      && HowMuchDoYouOweTask.isHowMuchDoYouOweValid(responseDraft.partialAdmission.howMuchDoYouOwe)
  }

  private static isHowMuchDoYouOweValid (model: HowMuchDoYouOwe): boolean {
    return !!model && validator.validateSync(model).length === 0
  }
}
