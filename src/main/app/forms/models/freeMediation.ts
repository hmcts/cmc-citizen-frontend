import { IsDefined, IsIn } from 'class-validator'

export class ValidationErrors {
  static readonly OPTION_REQUIRED: string = 'Choose option: yes or no'
}

export class FreeMediationOption {
  static readonly YES = 'yes'
  static readonly NO = 'no'

  static all (): string[] {
    return [
      FreeMediationOption.YES,
      FreeMediationOption.NO
    ]
  }
}

export class FreeMediation {
  @IsDefined({ message: ValidationErrors.OPTION_REQUIRED })
  @IsIn(FreeMediationOption.all(), { message: ValidationErrors.OPTION_REQUIRED })
  option?: string

  constructor (option?: string) {
    this.option = option
  }
}
