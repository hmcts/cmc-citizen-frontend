import { ResponseDraft } from 'response/draft/responseDraft'
import { Validator } from 'class-validator'
import { HowMuchDoYouOwe } from 'response/form/models/howMuchDoYouOwe'
import { YesNoOption } from 'models/yesNoOption'

const validator = new Validator()

export class WhenWillYouPay {
  static isCompleted (responseDraft: ResponseDraft): boolean {
    return responseDraft.isResponsePartiallyAdmitted()
      && responseDraft.partialAdmission.alreadyPaid.option === YesNoOption.NO
      && WhenWillYouPay.isWhenWillYouPayValid(responseDraft.partialAdmission.paymentOption)
  }

  private static isWhenWillYouPayValid (model: HowMuchDoYouOwe): boolean {
    return !!model && validator.validateSync(model).length === 0
  }
}
