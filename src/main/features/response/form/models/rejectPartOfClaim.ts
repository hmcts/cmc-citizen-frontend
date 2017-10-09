import { IsDefined, IsIn } from 'class-validator'

export class ValidationErrors {
  static readonly OPTION_REQUIRED: string = 'Please select a response'
}

export class RejectPartOfClaimOption {
  static readonly AMOUNT_TOO_HIGH = 'amountTooHigh'
  static readonly PAID_WHAT_BELIEVED_WAS_OWED = 'paidWhatBelievedWasOwed'

  static all (): string[] {
    return [
      RejectPartOfClaimOption.AMOUNT_TOO_HIGH,
      RejectPartOfClaimOption.PAID_WHAT_BELIEVED_WAS_OWED
    ]
  }
}

export class RejectPartOfClaim {
  @IsDefined({ message: ValidationErrors.OPTION_REQUIRED })
  @IsIn(RejectPartOfClaimOption.all(), { message: ValidationErrors.OPTION_REQUIRED })
  option?: string

  constructor (option?: string) {
    this.option = option
  }
}
