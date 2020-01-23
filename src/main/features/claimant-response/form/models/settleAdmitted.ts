import { IsDefined, IsIn } from '@hmcts/class-validator'
import { YesNoOption } from 'models/yesNoOption'

import { ValidationErrors } from 'forms/validation/validationErrors'

export class SettleAdmitted {
  @IsDefined({ message: ValidationErrors.YES_NO_REQUIRED })
  @IsIn(YesNoOption.all(), { message: ValidationErrors.YES_NO_REQUIRED })
  admitted?: YesNoOption

  constructor (admitted?: YesNoOption) {
    this.admitted = admitted
  }

  static fromObject (input?: any): SettleAdmitted {
    if (input == null) {
      return input
    }
    return new SettleAdmitted(YesNoOption.fromObject(input.admitted))
  }

  deserialize (input?: any): SettleAdmitted {
    if (input && input.admitted) {
      this.admitted = YesNoOption.fromObject(input.admitted.option)
    }

    return this
  }
}
