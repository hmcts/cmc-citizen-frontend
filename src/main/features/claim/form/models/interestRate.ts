import { IsDefined, IsIn, IsPositive, MaxLength, ValidateIf } from '@hmcts/class-validator'
import { IsNotBlank } from '@hmcts/cmc-validators'
import { CompletableTask } from 'models/task'
import { toNumberOrUndefined } from 'shared/utils/numericUtils'
import { ValidationErrors as CommonValidationErrors } from 'forms/validation/validationErrors'
import { getStandardInterestRate } from 'shared/interestUtils'
import { InterestRateOption } from 'claim/form/models/interestRateOption'

export class ValidationErrors {
  static readonly TYPE_REQUIRED: string = 'Choose a rate of interest'

  static readonly RATE_REQUIRED: string = 'You haven’t entered a rate'
  static readonly RATE_NOT_VALID: string = 'Correct the rate you’ve entered'

  static readonly REASON_REQUIRED: string = 'You haven’t explained why you’re claiming this rate'
}

export class InterestRate implements CompletableTask {

  @IsDefined({ message: ValidationErrors.TYPE_REQUIRED })
  @IsIn(InterestRateOption.all(), { message: ValidationErrors.TYPE_REQUIRED })
  type?: string

  @ValidateIf(o => o.type === InterestRateOption.DIFFERENT)
  @IsDefined({ message: ValidationErrors.RATE_REQUIRED })
  @IsPositive({ message: ValidationErrors.RATE_NOT_VALID })
  rate?: number

  @ValidateIf(o => o.type === InterestRateOption.DIFFERENT)
  @IsDefined({ message: ValidationErrors.REASON_REQUIRED })
  @IsNotBlank({ message: ValidationErrors.REASON_REQUIRED })
  @MaxLength(250, { message: CommonValidationErrors.REASON_TOO_LONG })
  reason?: string

  constructor (type?: string, rate?: number, reason?: string) {
    this.type = type
    this.rate = rate
    this.reason = reason
  }

  static fromObject (value?: any): InterestRate {
    if (value == null) {
      return value
    }

    const instance = new InterestRate(value.type, toNumberOrUndefined(value.rate), value.reason)

    switch (instance.type) {
      case InterestRateOption.STANDARD:
        instance.rate = getStandardInterestRate()
        instance.reason = undefined
        break
    }

    return instance
  }

  deserialize (input?: any): InterestRate {
    if (input) {
      this.type = input.type
      this.rate = input.rate
      this.reason = input.reason
    }

    return this
  }

  isCompleted (): boolean {
    return !!this.type && (this.type === InterestRateOption.STANDARD || this.type === InterestRateOption.DIFFERENT)
  }
}
