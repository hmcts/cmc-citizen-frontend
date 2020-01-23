import { YesNoOption } from 'models/yesNoOption'
import { IsDefined, IsIn } from '@hmcts/class-validator'
import { ValidationErrors } from 'forms/validation/validationErrors'

export class AcceptCourtOffer {
  @IsDefined({ message: ValidationErrors.YES_NO_REQUIRED })
  @IsIn(YesNoOption.all(), { message: ValidationErrors.YES_NO_REQUIRED })
  accept?: YesNoOption

  constructor (accept?: YesNoOption) {
    this.accept = accept
  }

  static fromObject (input?: any): AcceptCourtOffer {
    if (input == null) {
      return input
    }
    return new AcceptCourtOffer((YesNoOption.fromObject(input.accept)))
  }

  deserialize (input?: any): AcceptCourtOffer {
    if (input && input.accept) {
      this.accept = YesNoOption.fromObject(input.accept.option)
    }
    return this
  }
}
