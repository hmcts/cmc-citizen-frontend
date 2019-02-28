import { IsDefined, IsIn } from '@hmcts/class-validator'

export class ValidationErrors {
  static readonly OPTION_REQUIRED: string = 'Choose option: yes or no'
}

export class DefendantSettlementResponseOption {
  static readonly YES = 'yes'
  static readonly NO = 'no'

  static all (): string[] {
    return [
      DefendantSettlementResponseOption.YES,
      DefendantSettlementResponseOption.NO
    ]
  }
}

export class DefendantSettlementResponse {
  @IsDefined({ message: ValidationErrors.OPTION_REQUIRED })
  @IsIn(DefendantSettlementResponseOption.all(), { message: ValidationErrors.OPTION_REQUIRED })
  option?: string

  constructor (option?: string) {
    this.option = option
  }
}
