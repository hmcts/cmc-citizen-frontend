import { IsDefined, IsIn } from '@hmcts/class-validator'
import { YesNoOption } from 'models/yesNoOption'

import { ValidationErrors } from 'forms/validation/validationErrors'
import { CompletableTask } from 'models/task'

export class PermissionForExpert implements CompletableTask {
  @IsDefined({ message: ValidationErrors.YES_NO_REQUIRED })
  @IsIn(YesNoOption.all(), { message: ValidationErrors.YES_NO_REQUIRED })
  option?: YesNoOption

  constructor (requestPermissionForExpert?: YesNoOption) {
    this.option = requestPermissionForExpert
  }

  public static fromObject (input?: any): PermissionForExpert {
    if (!input) {
      return input
    }

    return new PermissionForExpert(YesNoOption.fromObject(input.option))
  }

  deserialize (input?: any): PermissionForExpert {
    if (input && input.option) {
      this.option = YesNoOption.fromObject(input.option.option)
    }

    return this
  }

  isCompleted (): boolean {
    return this.option !== undefined
  }
}
