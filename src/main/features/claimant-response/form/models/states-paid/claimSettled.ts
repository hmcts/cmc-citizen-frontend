import { IsDefined, IsIn } from '@hmcts/class-validator'
import { ValidationErrors } from 'forms/validation/validationErrors'
import { YesNoOption } from 'models/yesNoOption'

export class ClaimSettled {

  @IsDefined({ message: ValidationErrors.YES_NO_REQUIRED })
  @IsIn(YesNoOption.all(), { message: ValidationErrors.YES_NO_REQUIRED })
  accepted?: YesNoOption

  constructor (accepted?: YesNoOption) {
    this.accepted = accepted
  }

  static fromObject (input?: any): ClaimSettled {
    if (input == null) {
      return input
    }

    return new ClaimSettled(YesNoOption.fromObject(input.accepted))
  }

  deserialize (input?: any): ClaimSettled {
    if (input && input.accepted) {
      this.accepted = YesNoOption.fromObject(input.accepted.option)
    }

    return this
  }
}
