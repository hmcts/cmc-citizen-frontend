import { IsDefined, IsIn, IsPositive, ValidateIf } from 'class-validator'
import { CompletableTask } from 'app/models/task'
import { toNumberOrUndefined } from 'common/utils/numericUtils'
import { InterestRateOption } from 'claim/form/models/interestRateOption'

export class ValidationErrors {
  static readonly TYPE_REQUIRED: string = 'Choose a type of interest'

  static readonly RATE_REQUIRED: string = 'You haven’t entered a daily amount'
  static readonly RATE_NOT_VALID: string = 'Correct the amount you’ve entered'
}

export class InterestHowMuch implements CompletableTask {

  @IsDefined({ message: ValidationErrors.TYPE_REQUIRED })
  @IsIn(InterestRateOption.all(), { message: ValidationErrors.TYPE_REQUIRED })
  type?: string

  @ValidateIf(o => o.type === InterestRateOption.DIFFERENT)
  @IsDefined({ message: ValidationErrors.RATE_REQUIRED })
  @IsPositive({ message: ValidationErrors.RATE_NOT_VALID })
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
