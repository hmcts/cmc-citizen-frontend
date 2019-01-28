import { IsDefined, IsIn, MaxLength, ValidateIf } from 'class-validator'
import { IsNotBlank } from '@hmcts/cmc-validators'
import { CompletableTask } from 'models/task'
import { ValidationErrors as CommonValidationErrors } from 'forms/validation/validationErrors'
import { FreeMediationOption } from 'response/form/models/freeMediation'

export class ValidationErrors {
  static readonly OPTION_REQUIRED: string = 'Choose option: yes or no'
  static readonly NUMBER_REQUIRED: string = 'Please enter a phone number'
}

export class CanWeUse implements CompletableTask {

  @IsDefined({ message: ValidationErrors.OPTION_REQUIRED })
  @IsIn(FreeMediationOption.all(), { message: ValidationErrors.OPTION_REQUIRED })
  option?: string

  @ValidateIf(o => o.option === FreeMediationOption.NO)
  @IsDefined({ message: ValidationErrors.NUMBER_REQUIRED })
  @IsNotBlank({ message: ValidationErrors.NUMBER_REQUIRED })
  @MaxLength(30, { message: CommonValidationErrors.TEXT_TOO_LONG })
  mediationPhoneNumber?: string

  constructor (option?: string, mediationPhoneNumber?: string) {
    this.option = option
    this.mediationPhoneNumber = mediationPhoneNumber
  }

  static fromObject (value?: any): CanWeUse {
    if (value == null) {
      return value
    }

    return new CanWeUse(value.option, value.mediationPhoneNumber)
  }

  deserialize (input?: any): CanWeUse {
    if (input) {
      this.option = input.option
      this.mediationPhoneNumber = input.mediationPhoneNumber
    }

    return this
  }

  isCompleted (): boolean {
    return !!this.option && !!this.mediationPhoneNumber
  }
}
