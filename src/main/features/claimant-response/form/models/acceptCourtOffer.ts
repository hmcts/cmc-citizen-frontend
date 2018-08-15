import { YesNoOption } from 'models/yesNoOption'
import { IsDefined, IsIn } from 'class-validator'
import { ValidationErrors } from 'forms/validation/validationErrors'

export class AcceptCourtOffer {
  @IsDefined({ message: ValidationErrors.YES_NO_REQUIRED })
  @IsIn(YesNoOption.all(), { message: ValidationErrors.YES_NO_REQUIRED })
  acceptCourtOffer?: YesNoOption

  constructor (acceptCourtOffer?: YesNoOption) {
    this.acceptCourtOffer = acceptCourtOffer
  }

  static fromObject (input?: any): AcceptCourtOffer {
    if (input == null) {
      return input
    }
    return new AcceptCourtOffer((YesNoOption.fromObject(input.acceptCourtOffer)))
  }

  deserialize (input?: any): AcceptCourtOffer {
    if (input && input.acceptCourtOffer) {
      this.acceptCourtOffer = YesNoOption.fromObject(input.acceptCourtOffer.option)
    }
    return this
  }
}
