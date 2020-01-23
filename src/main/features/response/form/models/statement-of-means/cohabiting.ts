import { IsDefined, IsIn } from '@hmcts/class-validator'

export class ValidationErrors {
  static readonly OPTION_REQUIRED: string = 'Choose option: yes or no'
}

export class CohabitingOption {
  static readonly YES = 'yes'
  static readonly NO = 'no'

  static all (): string[] {
    return [
      CohabitingOption.YES,
      CohabitingOption.NO
    ]
  }
}

export class Cohabiting {
  @IsDefined({ message: ValidationErrors.OPTION_REQUIRED })
  @IsIn(CohabitingOption.all(), { message: ValidationErrors.OPTION_REQUIRED })
  option?: string

  constructor (option?: string) {
    this.option = option
  }
}
