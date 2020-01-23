import { IsDefined, IsIn } from '@hmcts/class-validator'
import { ValidationErrors } from 'forms/validation/validationErrors'
import { YesNoOption } from 'models/yesNoOption'

export class PartPaymentReceived {

  @IsDefined({ message: ValidationErrors.YES_NO_REQUIRED })
  @IsIn(YesNoOption.all(), { message: ValidationErrors.YES_NO_REQUIRED })
  received?: YesNoOption

  constructor (received?: YesNoOption) {
    this.received = received
  }

  static fromObject (input?: any): PartPaymentReceived {
    if (input == null) {
      return input
    }

    return new PartPaymentReceived(YesNoOption.fromObject(input.received))
  }

  deserialize (input?: any): PartPaymentReceived {
    if (input && input.received) {
      this.received = YesNoOption.fromObject(input.received.option)
    }

    return this
  }
}
