import { IsDefined, IsIn } from '@hmcts/class-validator'

export class ValidationErrors {
  static readonly OPTION_REQUIRED: string = 'Choose option: yes or no'
}

export class DisabilityOption {
  static readonly YES = 'yes'
  static readonly NO = 'no'

  static all (): string[] {
    return [
      DisabilityOption.YES,
      DisabilityOption.NO
    ]
  }
}

export class Disability {
  @IsDefined({ message: ValidationErrors.OPTION_REQUIRED })
  @IsIn(DisabilityOption.all(), { message: ValidationErrors.OPTION_REQUIRED })
  option?: string

  constructor (option?: string) {
    this.option = option
  }
}
