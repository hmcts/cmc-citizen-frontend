import { IsDefined, IsIn } from '@hmcts/class-validator'
import { ValidationErrors } from 'forms/validation/validationErrors'
import { YesNoOption } from 'models/yesNoOption'

export class Interest {

  @IsDefined({ message: ValidationErrors.YES_NO_REQUIRED })
  @IsIn(YesNoOption.all(), { message: ValidationErrors.YES_NO_REQUIRED })
  option?: YesNoOption

  constructor (option?: YesNoOption) {
    this.option = option
  }

  static fromObject (input?: any): Interest {
    if (input == null) {
      return input
    }
    return new Interest(YesNoOption.fromObject(input.option))
  }

  deserialize (input?: any): Interest {
    if (input && input.option) {
      this.option = YesNoOption.fromObject(input.option.option)
    }

    return this
  }
}
