import { IsDefined, IsIn } from 'class-validator'
import { YesNoOption } from 'models/yesNoOption'

import { ValidationErrors } from 'forms/validation/validationErrors'

export class PartnerSevereDisability {
  @IsDefined({ message: ValidationErrors.YES_NO_REQUIRED })
  @IsIn(YesNoOption.all(), { message: ValidationErrors.YES_NO_REQUIRED })
  option?: YesNoOption

  constructor (option?: YesNoOption) {
    this.option = option
  }

  public static fromObject (input?: any): PartnerSevereDisability {
    if (!input) {
      return input
    }

    return new PartnerSevereDisability(YesNoOption.fromObject(input.option))
  }

  deserialize (input?: any): PartnerSevereDisability {
    if (input && input.option) {
      this.option = YesNoOption.fromObject(input.option)
    }

    return this
  }
}
