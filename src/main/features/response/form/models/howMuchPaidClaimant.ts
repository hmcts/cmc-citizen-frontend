import { IsDefined, IsIn } from '@hmcts/class-validator'

export class ValidationErrors {
  static readonly OPTION_REQUIRED: string = 'Please select a response'
}

export class HowMuchPaidClaimantOption {
  static readonly AMOUNT_CLAIMED = 'amountClaimed'
  static readonly LESS_THAN_AMOUNT_CLAIMED = 'lessThenAmountClaimed'

  static all (): string[] {
    return [
      HowMuchPaidClaimantOption.AMOUNT_CLAIMED,
      HowMuchPaidClaimantOption.LESS_THAN_AMOUNT_CLAIMED
    ]
  }

}

export class HowMuchPaidClaimant {
  @IsDefined({ message: ValidationErrors.OPTION_REQUIRED })
  @IsIn(HowMuchPaidClaimantOption.all(), { message: ValidationErrors.OPTION_REQUIRED })
  option?: string

  constructor (option?: string) {
    this.option = option
  }
}
