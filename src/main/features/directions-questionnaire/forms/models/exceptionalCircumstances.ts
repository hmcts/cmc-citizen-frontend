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
  exceptionalCircumstances?: YesNoOption

  @ValidateIf(o => o.exceptionalCircumstances && o.exceptionalCircumstances.option === YesNoOption.YES.option)
  @IsNotEmpty({ message: ValidationErrors.REASON_REQUIRED })
  @IsDefined({ message: ValidationErrors.REASON_REQUIRED })
  reason?: string

  constructor (exceptionalCircumstances?: YesNoOption, reason?: string) {
    this.exceptionalCircumstances = exceptionalCircumstances
    this.reason = reason
  }

  static fromObject (input: any): ExceptionalCircumstances {
    if (!input) {
      return input
    }

    return new ExceptionalCircumstances(YesNoOption.fromObject(input.exceptionalCircumstances), input.reason)
  }

  deserialize (input: any): ExceptionalCircumstances {
    if (input) {
      this.exceptionalCircumstances = YesNoOption.fromObject(input.exceptionalCircumstances)
      this.reason = input.reason
    }

    return this
  }

  isCompleted (): boolean {
    if (this.exceptionalCircumstances === undefined) {
      return false
    } else if (this.exceptionalCircumstances.option === YesNoOption.YES.option) {
      return this.reason !== undefined
    } else {
      return true
    }
  }

}
