import { IsDefined, IsIn } from 'class-validator'
import { YesNoOption } from 'models/yesNoOption'

import { ValidationErrors } from 'forms/validation/validationErrors'

export class RejectPartOfClaim {
  @IsDefined({ message: ValidationErrors.YES_NO_REQUIRED })
  @IsIn(YesNoOption.all(), { message: ValidationErrors.YES_NO_REQUIRED })
  option?: YesNoOption

  constructor (option?: YesNoOption) {
    this.option = option
  }

  static fromObject (input: any) {
    return new RejectPartOfClaim(YesNoOption.fromObject(input.option))
  }

  deserialize (input?: any): RejectPartOfClaim {
    if (input && input.option) {
      this.option = YesNoOption.fromObject(input.option.option)
    }

    return this
  }
}
