import { IsDefined, IsIn } from 'class-validator'
import { YesNoOption } from 'models/yesNoOption'

import { ValidationErrors } from 'forms/validation/validationErrors'

export class Carer {
  @IsDefined({ message: ValidationErrors.YES_NO_REQUIRED })
  @IsIn(YesNoOption.all(), { message: ValidationErrors.YES_NO_REQUIRED })
  option?: YesNoOption

  constructor (option?: YesNoOption) {
    this.option = option
  }

  public static fromObject (input?: any): Carer {
    if (!input) {
      return input
    }

    return new Carer(YesNoOption.fromObject(input.option))
  }

  deserialize (input?: any): Carer {
    if (input && input.option) {
      this.option = YesNoOption.fromObject(input.option)
    }

    return this
  }
}
