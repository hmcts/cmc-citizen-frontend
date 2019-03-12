import { IsDefined, IsInt, Min, ValidateIf } from '@hmcts/class-validator'
import { ValidationErrors as GlobalValidationErrors } from 'forms/validation/validationErrors'
import { CompletableTask } from 'models/task'
import * as toBoolean from 'to-boolean'
import { toNumberOrUndefined } from 'shared/utils/numericUtils'

export class OtherWitnesses implements CompletableTask {
  @IsDefined({ message: GlobalValidationErrors.YES_NO_REQUIRED })
  otherWitnesses?: boolean

  @ValidateIf(o => o.otherWitnesses === true)
  @IsDefined()
  @IsInt({ message: GlobalValidationErrors.INTEGER_REQUIRED })
  @Min(1, { message: GlobalValidationErrors.POSITIVE_NUMBER_REQUIRED })
  howMany?: number

  constructor (otherWitnesses?: boolean, howMany?: number) {
    this.otherWitnesses = otherWitnesses
    this.howMany = howMany
  }

  static fromObject (value?: any): OtherWitnesses {
    if (!value) {
      return value
    }

    return new OtherWitnesses(value.otherWitnesses !== undefined ? toBoolean(value.otherWitnesses) === true : undefined,
      toNumberOrUndefined(value.howMany))
  }

  deserialize (input?: any): OtherWitnesses {
    if (input) {
      this.otherWitnesses = input.otherWitnesses
      if (input.otherWitnesses) {
        this.howMany = toNumberOrUndefined(input.howMany)
      }
    }
    return this
  }

  isCompleted (): boolean {
    if (this.otherWitnesses === undefined) {
      return false
    } else if (this.otherWitnesses) {
      return this.howMany !== undefined
    } else {
      return true
    }
  }
}
