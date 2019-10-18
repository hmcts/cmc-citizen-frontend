import { IsDefined, IsIn } from '@hmcts/class-validator'

export class ValidationErrors {
  static readonly OPTION_REQUIRED: string = 'Choose option: yes or no'
}

export class PartnerAgeOption {
  static readonly YES = 'yes'
  static readonly NO = 'no'

  static all (): string[] {
    return [
      PartnerAgeOption.YES,
      PartnerAgeOption.NO
    ]
  }
}

export class PartnerAge {
  @IsDefined({ message: ValidationErrors.OPTION_REQUIRED })
  @IsIn(PartnerAgeOption.all(), { message: ValidationErrors.OPTION_REQUIRED })
  option?: string

  constructor (option?: string) {
    this.option = option
  }
}
