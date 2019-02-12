import { ResponseDraft } from 'response/draft/responseDraft'
import { Validator } from '@hmcts/class-validator'
import { HowMuchDoYouOwe } from 'response/form/models/howMuchDoYouOwe'
import { YesNoOption } from 'models/yesNoOption'
import { PaymentType } from 'shared/components/payment-intention/model/paymentOption'

const validator = new Validator()

function isValid (model: HowMuchDoYouOwe): boolean {
  return !!model && validator.validateSync(model).length === 0
}

export class WhenWillYouPayTask {
  static isCompleted (responseDraft: ResponseDraft): boolean {

    if (responseDraft.partialAdmission.paymentIntention
      && responseDraft.partialAdmission.paymentIntention.paymentOption
      && responseDraft.partialAdmission.paymentIntention.paymentOption.isOfType(PaymentType.BY_SET_DATE)) {
      return isValid(responseDraft.partialAdmission.paymentIntention.paymentDate)
    }

    return responseDraft.partialAdmission.alreadyPaid.option === YesNoOption.NO
      && responseDraft.partialAdmission.paymentIntention !== undefined
      && isValid(responseDraft.partialAdmission.paymentIntention.paymentOption)
  }
}
