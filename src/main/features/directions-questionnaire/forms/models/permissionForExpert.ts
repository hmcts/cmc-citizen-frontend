import { IsDefined, IsIn } from '@hmcts/class-validator'
import { YesNoOption } from 'models/yesNoOption'

import { ValidationErrors } from 'forms/validation/validationErrors'
import { CompletableTask } from 'models/task'

export class PermissionForExpert implements CompletableTask {
  @IsDefined({ message: ValidationErrors.YES_NO_REQUIRED })
  @IsIn(YesNoOption.all(), { message: ValidationErrors.YES_NO_REQUIRED })
  requestPermissionForExpert?: YesNoOption

  constructor (requestPermissionForExpert?: YesNoOption) {
    this.requestPermissionForExpert = requestPermissionForExpert
  }

  public static fromObject (input?: any): PermissionForExpert {
    if (!input) {
      return input
    }

    return new PermissionForExpert(YesNoOption.fromObject(input.requestPermissionForExpert))
  }

  deserialize (input?: any): PermissionForExpert {
    if (input && input.requestPermissionForExpert) {
      this.requestPermissionForExpert = YesNoOption.fromObject(input.requestPermissionForExpert)
    }

    return this
  }

  isCompleted (): boolean {
    return this.requestPermissionForExpert !== undefined
  }
}
