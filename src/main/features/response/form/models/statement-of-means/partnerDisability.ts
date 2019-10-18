import { IsDefined, IsIn } from '@hmcts/class-validator'

export class ValidationErrors {
  static readonly OPTION_REQUIRED: string = 'Choose option: yes or no'
}

export class PartnerDisabilityOption {
  static readonly YES = 'yes'
  static readonly NO = 'no'

  static all (): string[] {
    return [
      PartnerDisabilityOption.YES,
      PartnerDisabilityOption.NO
    ]
  }
}

export class PartnerDisability {
  @IsDefined({ message: ValidationErrors.OPTION_REQUIRED })
  @IsIn(PartnerDisabilityOption.all(), { message: ValidationErrors.OPTION_REQUIRED })
  option?: string

  constructor (option?: string) {
    this.option = option
  }
}
