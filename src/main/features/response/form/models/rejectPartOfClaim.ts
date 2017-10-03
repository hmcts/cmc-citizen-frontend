import { IsDefined, IsIn } from 'class-validator'

export class ValidationErrors {
  static readonly OPTION_REQUIRED: string = 'Please select a response'
}

export class RejectPartOfClaimOption {
  static readonly TOO_MUCH = 'tooMuchAmount'
  static readonly PAID_BELIEVED_OWED = 'paidBelievedOwed'

  static all (): string[] {
    return [
      RejectPartOfClaimOption.TOO_MUCH,
      RejectPartOfClaimOption.PAID_BELIEVED_OWED
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
