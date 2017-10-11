import { IsDefined, IsIn } from 'class-validator'

export class ValidationErrors {
  static readonly OPTION_REQUIRED: string = 'Please select a response'
}

export class RejectAllOfClaimOption {
  static readonly ALREADY_PAID = 'alreadyPaid'
  static readonly DISPUTE = 'dispute'
  static readonly COUNTER_CLAIM = 'counterClaim'

  static all (): string[] {
    return [
      RejectAllOfClaimOption.ALREADY_PAID,
      RejectAllOfClaimOption.DISPUTE,
      RejectAllOfClaimOption.COUNTER_CLAIM
    ]
  }

  static except (option: string): string[] {
    if (option === undefined) {
      throw new Error('Option is required')
    }
    return RejectAllOfClaimOption.all().filter(_ => _ !== option)
  }
}

export class RejectAllOfClaim {
  @IsDefined({ message: ValidationErrors.OPTION_REQUIRED })
  @IsIn(RejectAllOfClaimOption.all(), { message: ValidationErrors.OPTION_REQUIRED })
  option?: string

  constructor (option?: string) {
    this.option = option
  }
}
