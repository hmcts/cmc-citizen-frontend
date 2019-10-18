import { IsDefined, IsIn } from '@hmcts/class-validator'
import { ValidationErrors } from 'forms/validation/validationErrors'
import { YesNoOption } from 'models/yesNoOption'
import { CompletableTask } from 'models/task'

export class InterestContinueClaiming implements CompletableTask {

  @IsDefined({ message: ValidationErrors.YES_NO_REQUIRED })
  @IsIn(YesNoOption.all(), { message: ValidationErrors.YES_NO_REQUIRED })
  option?: YesNoOption

  constructor (option?: YesNoOption) {
    this.option = option
  }

  static fromObject (input?: any): InterestContinueClaiming {
    if (input == null) {
      return input
    }

    return new InterestContinueClaiming(YesNoOption.fromObject(input.option))
  }

  deserialize (input?: any): InterestContinueClaiming {
    if (input && input.option) {
      this.option = YesNoOption.fromObject(input.option.option)
    }

    return this
  }

  isCompleted (): boolean {
    return !!this.option
  }
}
