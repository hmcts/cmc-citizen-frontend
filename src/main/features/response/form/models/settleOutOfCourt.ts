import { IsDefined, IsIn } from 'class-validator'

export class ValidationErrors {
  static readonly OPTION_REQUIRED: string = 'Please select yes or no'
}

export class SettleOutOfCourtOption {
  static readonly YES = 'yes'
  static readonly NO = 'no'

  static all (): string[] {
    return [
      SettleOutOfCourtOption.YES,
      SettleOutOfCourtOption.NO
    ]
  }
}

export class SettleOutOfCourt {
  @IsDefined({ message: ValidationErrors.OPTION_REQUIRED })
  @IsIn(SettleOutOfCourtOption.all(), { message: ValidationErrors.OPTION_REQUIRED })
  option?: string

  constructor (option?: string) {
    this.option = option
  }
}
