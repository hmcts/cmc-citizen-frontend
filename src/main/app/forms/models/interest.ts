import { IsDefined, IsIn, IsPositive, MaxLength, ValidateIf } from 'class-validator'

import { Serializable } from 'models/serializable'
import { IsNotBlank } from 'forms/validation/validators/isBlank'
import { CompletableTask } from 'app/models/task'

export class InterestType {
  static readonly NO_INTEREST: string = 'no interest'
  static readonly STANDARD: string = 'standard'
  static readonly DIFFERENT: string = 'different'

  static all (): string[] {
    return [
      InterestType.NO_INTEREST,
      InterestType.STANDARD,
      InterestType.DIFFERENT
    ]
  }
}

export class ValidationErrors {
  static readonly TYPE_REQUIRED: string = 'Choose a rate of interest'

  static readonly RATE_REQUIRED: string = 'You haven\'t entered a rate'
  static readonly RATE_NOT_VALID: string = 'Correct the rate you\'ve entered'

  static readonly REASON_REQUIRED: string = 'You haven\'t explained why you\'re claiming this rate'
  static readonly REASON_TOO_LONG: string = 'Enter reason no longer than $constraint1 characters'
}

export default class Interest implements Serializable <Interest>, CompletableTask {

  static readonly STANDARD_RATE = 8

  @IsDefined({ message: ValidationErrors.TYPE_REQUIRED })
  @IsIn(InterestType.all(), { message: ValidationErrors.TYPE_REQUIRED })
  type?: string

  @ValidateIf(o => o.type === InterestType.DIFFERENT)
  @IsDefined({ message: ValidationErrors.RATE_REQUIRED })
  @IsPositive({ message: ValidationErrors.RATE_NOT_VALID })
  rate?: number

  @ValidateIf(o => o.type === InterestType.DIFFERENT)
  @IsDefined({ message: ValidationErrors.REASON_REQUIRED })
  @IsNotBlank({ message: ValidationErrors.REASON_REQUIRED })
  @MaxLength(250, { message: ValidationErrors.REASON_TOO_LONG })
  reason?: string

  constructor (type?: string, rate?: number, reason?: string) {
    this.type = type
    this.rate = rate
    this.reason = reason
  }

  static fromObject (value?: any): Interest {
    if (value == null) {
      return value
    }

    const instance = new Interest(value.type, value.rate ? parseFloat(value.rate) : undefined, value.reason)

    switch (instance.type) {
      case InterestType.STANDARD:
        instance.rate = Interest.STANDARD_RATE
        instance.reason = undefined
        break
      case InterestType.NO_INTEREST:
        instance.rate = undefined
        instance.reason = undefined
        break
    }

    return instance
  }

  deserialize (input?: any): Interest {
    if (input) {
      this.type = input.type
      this.rate = input.rate
      this.reason = input.reason
    }

    return this
  }

  isCompleted (): boolean {
    return !!this.type && this.type.length > 0
  }
}
