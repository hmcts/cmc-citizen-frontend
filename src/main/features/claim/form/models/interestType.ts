import { IsDefined, IsIn } from 'class-validator'

export class InterestTypeOption {
  static readonly SAME_RATE = 'same'
  static readonly BREAKDOWN = 'breakdown'

  static all (): string[] {
    return [
      InterestTypeOption.SAME_RATE,
      InterestTypeOption.BREAKDOWN
    ]
  }
}

export class ValidationErrors {
  static readonly INTEREST_TYPE_REQUIRED: string = 'Choose same rate or breakdown'
}

export class InterestType {

  @IsDefined({ message: ValidationErrors.INTEREST_TYPE_REQUIRED })
  @IsIn(InterestTypeOption.all(), { message: ValidationErrors.INTEREST_TYPE_REQUIRED })
  interestType?: string

  constructor (interestType?: string) {
    this.interestType = interestType
  }

  deserialize (input?: any): InterestType {
    if (input) {
      this.interestType = input
    }

    return this
  }
}
