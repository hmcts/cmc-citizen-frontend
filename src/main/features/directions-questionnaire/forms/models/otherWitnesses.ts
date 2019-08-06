import { IsDefined, IsInt, Max, Min, ValidateIf } from '@hmcts/class-validator'
import {
  ValidationErrors as DefaultValidationErrors,
  ValidationErrors as GlobalValidationErrors
} from 'forms/validation/validationErrors'
import { CompletableTask } from 'models/task'
import { toNumberOrUndefined } from 'shared/utils/numericUtils'
import { YesNoOption } from 'models/yesNoOption'

export class OtherWitnesses implements CompletableTask {
  @IsDefined({ message: GlobalValidationErrors.YES_NO_REQUIRED })
  otherWitnesses?: YesNoOption

  @ValidateIf(o => o.otherWitnesses && o.otherWitnesses.option === YesNoOption.YES.option)
  @IsDefined()
  @IsInt({ message: GlobalValidationErrors.INTEGER_REQUIRED })
  @Min(1, { message: GlobalValidationErrors.POSITIVE_NUMBER_REQUIRED })
  @Max(100, { message: DefaultValidationErrors.BELOW_OR_EQUAL_TO_100_REQUIRED })

  howMany?: number

  constructor (otherWitnesses?: YesNoOption, howMany?: number) {
    this.otherWitnesses = otherWitnesses
    this.howMany = howMany
  }

  static fromObject (value?: any): OtherWitnesses {
    if (!value) {
      return value
    }

    return new OtherWitnesses(
      YesNoOption.fromObject(value.otherWitnesses),
      toNumberOrUndefined(value.howMany))
  }

  deserialize (input?: any): OtherWitnesses {
    if (input && input.otherWitnesses) {
      this.otherWitnesses = YesNoOption.fromObject(input.otherWitnesses.option)
      if (input.otherWitnesses) {
        this.howMany = toNumberOrUndefined(input.howMany)
      }
    }
    return this
  }

  isCompleted (): boolean {
    if (this.otherWitnesses === undefined) {
      return false
    } else if (this.otherWitnesses.option === YesNoOption.YES.option) {
      return this.howMany !== undefined
    } else {
      return true
    }
  }
}
