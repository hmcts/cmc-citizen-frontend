import { IsDefined, IsIn } from '@hmcts/class-validator'
import { YesNoOption } from 'models/yesNoOption'

import { ValidationErrors } from 'forms/validation/validationErrors'
import { CompletableTask } from 'models/task'

export class SelfWitness implements CompletableTask {
  @IsDefined({ message: ValidationErrors.YES_NO_REQUIRED })
  @IsIn(YesNoOption.all(), { message: ValidationErrors.YES_NO_REQUIRED })
  option?: YesNoOption

  constructor (option?: YesNoOption) {
    this.option = option
  }

  public static fromObject (input?: any): SelfWitness {
    if (!input) {
      return input
    }

    return new SelfWitness(YesNoOption.fromObject(input.option))
  }

  deserialize (input?: any): SelfWitness {
    if (input && input.option) {
      this.option = YesNoOption.fromObject(input.option)
    }

    return this
  }

  isCompleted (): boolean {
    return this.option !== undefined
  }
}
