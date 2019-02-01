import { IsDefined, IsIn } from '@hmcts/class-validator'
import { YesNoOption } from 'models/yesNoOption'

import { ValidationErrors } from 'forms/validation/validationErrors'

export class AcceptPaymentMethod {
  @IsDefined({ message: ValidationErrors.YES_NO_REQUIRED })
  @IsIn(YesNoOption.all(), { message: ValidationErrors.YES_NO_REQUIRED })
  accept?: YesNoOption

  constructor (accept?: YesNoOption) {
    this.accept = accept
  }

  static fromObject (input?: any): AcceptPaymentMethod {
    if (input == null) {
      return input
    }
    return new AcceptPaymentMethod(YesNoOption.fromObject(input.accept))
  }

  deserialize (input?: any): AcceptPaymentMethod {
    if (input && input.accept) {
      this.accept = YesNoOption.fromObject(input.accept.option)
    }
    return this
  }
}
