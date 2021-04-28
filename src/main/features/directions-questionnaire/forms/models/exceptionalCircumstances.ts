import { YesNoOption } from 'models/yesNoOption'
import { IsDefined, IsIn, IsNotEmpty, MaxLength, ValidateIf } from '@hmcts/class-validator'
import {
  ValidationErrors as DefaultValidationErrors,
  ValidationErrors as GlobalValidationErrors
} from 'forms/validation/validationErrors'
import { ValidationConstraints } from 'forms/validation/validationConstraints'

export class ValidationErrors {
  static readonly REASON_REQUIRED: string = 'Explain your reason for the hearing to be in a different location'
}

export class ExceptionalCircumstances {

  @IsDefined({ message: GlobalValidationErrors.YES_NO_REQUIRED })
  @IsIn(YesNoOption.all(), { message: GlobalValidationErrors.YES_NO_REQUIRED })
  exceptionalCircumstances?: YesNoOption

  @ValidateIf(o => o.exceptionalCircumstances && o.exceptionalCircumstances.option === YesNoOption.YES.option)
  @IsNotEmpty({ message: ValidationErrors.REASON_REQUIRED })
  @IsDefined({ message: ValidationErrors.REASON_REQUIRED })
  @MaxLength(ValidationConstraints.FREE_TEXT_MAX_LENGTH, { message: DefaultValidationErrors.TEXT_TOO_LONG })
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
    if (!input) {
      return input
    }

    if (input && input.exceptionalCircumstances && input.exceptionalCircumstances.option) {
      this.exceptionalCircumstances = YesNoOption.fromObject(input.exceptionalCircumstances.option)
      this.reason = input.reason
    }

    return this
  }

  isDefendantCompleted (): boolean {
    if (this.exceptionalCircumstances === undefined) {
      return false
    } else if (this.exceptionalCircumstances.option === YesNoOption.YES.option) {
      return this.reason !== undefined
    } else {
      return true
    }
  }

  isClaimantCompleted (): boolean {
    if (this.exceptionalCircumstances === undefined) {
      return false
    } else if (this.exceptionalCircumstances.option === YesNoOption.YES.option) {
      return this.reason !== undefined
    } else {
      return true
    }
  }

}
