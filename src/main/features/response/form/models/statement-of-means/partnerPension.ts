import { IsDefined, IsIn } from '@hmcts/class-validator'

export class ValidationErrors {
  static readonly OPTION_REQUIRED: string = 'Choose option: yes or no'
}

export class PartnerPensionOption {
  static readonly YES = 'yes'
  static readonly NO = 'no'

  static all (): string[] {
    return [
      PartnerPensionOption.YES,
      PartnerPensionOption.NO
    ]
  }
}

export class PartnerPension {
  @IsDefined({ message: ValidationErrors.OPTION_REQUIRED })
  @IsIn(PartnerPensionOption.all(), { message: ValidationErrors.OPTION_REQUIRED })
  option?: string

  constructor (option?: string) {
    this.option = option
  }
}
