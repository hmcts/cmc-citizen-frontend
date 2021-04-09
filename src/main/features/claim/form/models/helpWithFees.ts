import { IsDefined, IsIn, ValidateIf, MaxLength } from '@hmcts/class-validator'
import { IsNotBlank } from '@hmcts/cmc-validators'
import { ValidationErrors as CommonValidationErrors } from 'forms/validation/validationErrors'
import { YesNoOption } from 'models/yesNoOption'
import { CompletableTask } from 'models/task'

class ValidationErrors {
  static HELP_WITH_FEES_NUMBER_REQUIRED: string = 'Enter your Help With Fees reference number'
}

export class HelpWithFees implements CompletableTask {

  @IsDefined({ message: CommonValidationErrors.YES_NO_REQUIRED })
  @IsIn(YesNoOption.all(), { message: CommonValidationErrors.YES_NO_REQUIRED })
  declared?: YesNoOption

  @ValidateIf(o => o.declared === YesNoOption.YES)
  @IsDefined({ message: ValidationErrors.HELP_WITH_FEES_NUMBER_REQUIRED })
  @IsNotBlank({ message: ValidationErrors.HELP_WITH_FEES_NUMBER_REQUIRED })
  @MaxLength(11, { message: 'Enter your 11 character Help with Fees number' })
  helpWithFeesNumber?: string

  constructor (declared?: YesNoOption, helpWithFeesNumber?: string) {
    this.declared = declared
    this.helpWithFeesNumber = helpWithFeesNumber
  }

  static fromObject (value?: any): HelpWithFees {
    if (!value) {
      return value
    }

    return new HelpWithFees(YesNoOption.fromObject(value.declared), value.helpWithFeesNumber)
  }

  deserialize (input?: any): HelpWithFees {
    if (input) {
      this.declared = input.declared
      this.helpWithFeesNumber = input.helpWithFeesNumber
    }

    return this
  }

  isCompleted (): boolean {
    if (!this.declared) {
      return false
    }
    return this.declared.option === YesNoOption.NO.option
      || (this.declared.option === YesNoOption.YES.option && this.helpWithFeesNumber && !!this.helpWithFeesNumber.length)
  }
}
