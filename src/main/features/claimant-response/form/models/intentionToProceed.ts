import { IsDefined, IsIn } from '@hmcts/class-validator'
import { ValidationErrors } from 'forms/validation/validationErrors'
import { YesNoOption } from 'models/yesNoOption'

export class IntentionToProceed {

  @IsDefined({ message: ValidationErrors.YES_NO_REQUIRED })
  @IsIn(YesNoOption.all(), { message: ValidationErrors.YES_NO_REQUIRED })
  proceed?: YesNoOption

  constructor (proceed?: YesNoOption) {
    this.proceed = proceed
  }

  static fromObject (input?: any): IntentionToProceed {
    if (!input) {
      return input
    }
    return new IntentionToProceed(YesNoOption.fromObject(input.proceed))
  }

  deserialize (input?: any): IntentionToProceed {
    if (input && input.proceed) {
      this.proceed = YesNoOption.fromObject(input.proceed.option)
    }

    return this
  }
}
