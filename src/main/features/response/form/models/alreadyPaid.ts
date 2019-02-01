import { IsDefined, IsIn } from '@hmcts/class-validator'
import { YesNoOption } from 'models/yesNoOption'

import { ValidationErrors } from 'forms/validation/validationErrors'

export class AlreadyPaid {
  @IsDefined({ message: ValidationErrors.YES_NO_REQUIRED })
  @IsIn(YesNoOption.all(), { message: ValidationErrors.YES_NO_REQUIRED })
  option?: YesNoOption

  constructor (option?: YesNoOption) {
    this.option = option
  }

  public static fromObject (input?: any): AlreadyPaid {
    if (!input) {
      return input
    }

    return new AlreadyPaid(YesNoOption.fromObject(input.option))
  }

  deserialize (input?: any): AlreadyPaid {
    if (input && input.option) {
      this.option = YesNoOption.fromObject(input.option)
    }

    return this
  }
}
