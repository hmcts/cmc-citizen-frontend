import { IsDefined, IsIn } from 'class-validator'
import { YesNoOption } from 'models/yesNoOption'

import { ValidationErrors } from 'forms/validation/validationErrors'

export class SettleAdmitted {
  @IsDefined({ message: ValidationErrors.YES_NO_REQUIRED })
  @IsIn(YesNoOption.all(), { message: ValidationErrors.YES_NO_REQUIRED })
  admitted?: YesNoOption

  constructor (option?: YesNoOption) {
    this.admitted = option
  }

  public static fromObject (input?: any): SettleAdmitted {
    if (!input) {
      return input
    }

    return new SettleAdmitted(YesNoOption.fromObject(input.admitted))
  }

  deserialize (input?: any): SettleAdmitted {
    if (input && input.admitted) {
      this.admitted = YesNoOption.fromObject(input.admitted)
    }

    return this
  }
}
