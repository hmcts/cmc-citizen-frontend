import { IsDefined, MaxLength, Min } from '@hmcts/class-validator'
import { CompletableTask } from 'models/task'
import { ValidationErrors as CommonValidationErrors } from 'forms/validation/validationErrors'
import { IsNotBlank, Fractions } from '@hmcts/cmc-validators'
import { toNumberOrUndefined } from 'shared/utils/numericUtils'

export class ValidationErrors {
  static readonly REASON_REQUIRED: string = 'You must tell us how you calculated the amount'
}

export class InterestTotal implements CompletableTask {

  @IsDefined({ message: CommonValidationErrors.AMOUNT_REQUIRED })
  @Min(0.01, { message: CommonValidationErrors.AMOUNT_NOT_VALID })
  @Fractions(0, 2, { message: CommonValidationErrors.AMOUNT_INVALID_DECIMALS })
  amount?: number

  @IsDefined({ message: ValidationErrors.REASON_REQUIRED })
  @IsNotBlank({ message: ValidationErrors.REASON_REQUIRED })
  @MaxLength(10000, { message: CommonValidationErrors.REASON_TOO_LONG })
  reason?: string

  constructor (amount?: number, reason?: string) {
    this.amount = amount
    this.reason = reason
  }

  static fromObject (value?: any): InterestTotal {
    if (value == null) {
      return value
    }

    return new InterestTotal(toNumberOrUndefined(value.amount), value.reason)
  }

  deserialize (input?: any): InterestTotal {
    if (input) {
      this.amount = input.amount
      this.reason = input.reason
    }

    return this
  }

  isCompleted (): boolean {
    return !!this.amount && !!this.reason
  }
}
