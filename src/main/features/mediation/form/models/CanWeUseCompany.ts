import { IsDefined, IsIn, MaxLength, ValidateIf } from '@hmcts/class-validator'
import { IsNotBlank } from '@hmcts/cmc-validators'
import { CompletableTask } from 'models/task'
import { ValidationErrors as CommonValidationErrors } from 'forms/validation/validationErrors'
import { FreeMediationOption } from 'main/app/forms/models/freeMediation'

export class ValidationErrors {
  static readonly OPTION_REQUIRED: string = 'Choose option: yes or no'
  static readonly NUMBER_REQUIRED: string = 'Please enter a phone number'
  static readonly NAME_REQUIRED: string = 'Please enter a name'
}

export class CanWeUseCompany implements CompletableTask {

  @IsDefined({ message: ValidationErrors.OPTION_REQUIRED })
  @IsIn(FreeMediationOption.all(), { message: ValidationErrors.OPTION_REQUIRED })
  option?: string

  @ValidateIf(o => o.option === FreeMediationOption.YES)
  @IsDefined({ message: ValidationErrors.NUMBER_REQUIRED })
  @IsNotBlank({ message: ValidationErrors.NUMBER_REQUIRED })
  @MaxLength(30, { message: CommonValidationErrors.TEXT_TOO_LONG })
  mediationPhoneNumberConfirmation?: string

  @ValidateIf(o => o.option === FreeMediationOption.NO)
  @IsDefined({ message: ValidationErrors.NUMBER_REQUIRED })
  @IsNotBlank({ message: ValidationErrors.NUMBER_REQUIRED })
  @MaxLength(30, { message: CommonValidationErrors.TEXT_TOO_LONG })
  mediationPhoneNumber?: string

  @ValidateIf(o => o.option === FreeMediationOption.NO)
  @IsDefined({ message: ValidationErrors.NAME_REQUIRED })
  @IsNotBlank({ message: ValidationErrors.NAME_REQUIRED })
  @MaxLength(30, { message: CommonValidationErrors.TEXT_TOO_LONG })
  mediationContactPerson?: string

  constructor (option?: string, mediationPhoneNumber?: string, mediationContactName?: string, mediationPhoneNumberConfirmation?: string) {
    this.option = option
    this.mediationPhoneNumber = mediationPhoneNumber
    this.mediationContactPerson = mediationContactName
    this.mediationPhoneNumberConfirmation = mediationPhoneNumberConfirmation
  }

  static fromObject (value?: any): CanWeUseCompany {
    if (value == null) {
      return value
    }

    return new CanWeUseCompany(value.option, value.mediationPhoneNumber, value.mediationContactPerson, value.mediationPhoneNumberConfirmation)
  }

  deserialize (input?: any): CanWeUseCompany {
    if (input) {
      this.option = input.option
      this.mediationPhoneNumber = input.mediationPhoneNumber
      this.mediationContactPerson = input.mediationContactPerson
      this.mediationPhoneNumberConfirmation = input.mediationPhoneNumberConfirmation
    }

    return this
  }

  isCompleted (): boolean {
    return !!this.option && ((!!this.mediationPhoneNumber && !!this.mediationContactPerson) || !!this.mediationPhoneNumberConfirmation)
  }
}
