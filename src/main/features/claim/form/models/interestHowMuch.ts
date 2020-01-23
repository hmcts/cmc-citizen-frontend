import { IsDefined, IsIn, IsPositive, ValidateIf } from '@hmcts/class-validator'
import { CompletableTask } from 'models/task'
import { toNumberOrUndefined } from 'shared/utils/numericUtils'
import { InterestRateOption } from 'claim/form/models/interestRateOption'
import { Fractions } from '@hmcts/cmc-validators'
import { ValidationErrors as CommonValidationErrors } from 'forms/validation/validationErrors'

export class ValidationErrors {
  static readonly TYPE_REQUIRED: string = 'Choose a type of interest'
}

export class InterestHowMuch implements CompletableTask {

  @IsDefined({ message: ValidationErrors.TYPE_REQUIRED })
  @IsIn(InterestRateOption.all(), { message: ValidationErrors.TYPE_REQUIRED })
  type?: InterestRateOption

  @ValidateIf(o => o.type === InterestRateOption.DIFFERENT)
  @IsDefined({ message: CommonValidationErrors.AMOUNT_REQUIRED })
  @IsPositive({ message: CommonValidationErrors.AMOUNT_NOT_VALID })
  @Fractions(0, 2, { message: CommonValidationErrors.AMOUNT_INVALID_DECIMALS })
  dailyAmount?: number

  constructor (type?: string, dailyAmount?: number) {
    this.type = type
    this.dailyAmount = dailyAmount
  }

  static fromObject (value?: any): InterestHowMuch {
    if (value == null) {
      return value
    }

    return new InterestHowMuch(value.type, toNumberOrUndefined(value.dailyAmount))
  }

  deserialize (input?: any): InterestHowMuch {
    if (input) {
      this.type = input.type
      this.dailyAmount = input.dailyAmount
    }

    return this
  }

  isCompleted (): boolean {
    return !!this.type && (this.type === InterestRateOption.STANDARD || this.type === InterestRateOption.DIFFERENT)
  }
}
