import { CompletableTask } from 'models/task'
import { YesNoOption } from 'models/yesNoOption'
import { IsDefined, IsIn, IsNotEmpty, ValidateIf } from '@hmcts/class-validator'
import { ValidationErrors as GlobalValidationErrors } from 'forms/validation/validationErrors'

export class ValidationErrors {
  static readonly REASON_REQUIRED: string = 'Explain your reason for the hearing to be in a different location'
}

export class ExceptionalCircumstances implements CompletableTask {

  @IsDefined({ message: GlobalValidationErrors.YES_NO_REQUIRED })
  @IsIn(YesNoOption.all(), { message: GlobalValidationErrors.YES_NO_REQUIRED })
  option?: YesNoOption

  @ValidateIf(o => o.option && o.option.option === YesNoOption.YES.option)
  @IsNotEmpty({ message: ValidationErrors.REASON_REQUIRED })
  @IsDefined({ message: ValidationErrors.REASON_REQUIRED })
  reason?: string

  constructor (option?: YesNoOption, reason?: string) {
    this.option = option
    this.reason = reason
  }

  static fromObject (input: any): ExceptionalCircumstances {
    if (!input) {
      return input
    }

    return new ExceptionalCircumstances(YesNoOption.fromObject(input.option), input.reason)
  }

  deserialize (input: any): ExceptionalCircumstances {
    if (input) {
      this.option = YesNoOption.fromObject(input.option)
      this.reason = input.reason
    }

    return this
  }

  isCompleted (): boolean {
    return false
  }

}
