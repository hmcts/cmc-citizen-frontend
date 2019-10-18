import { IsDefined, IsIn } from '@hmcts/class-validator'

export class ValidationErrors {
  static readonly OPTION_REQUIRED: string = 'Choose option: yes or no'
}

export class SevereDisabilityOption {
  static readonly YES = 'yes'
  static readonly NO = 'no'

  static all (): string[] {
    return [
      SevereDisabilityOption.YES,
      SevereDisabilityOption.NO
    ]
  }
}

export class SevereDisability {
  @IsDefined({ message: ValidationErrors.OPTION_REQUIRED })
  @IsIn(SevereDisabilityOption.all(), { message: ValidationErrors.OPTION_REQUIRED })
  option?: string

  constructor (option?: string) {
    this.option = option
  }
}
