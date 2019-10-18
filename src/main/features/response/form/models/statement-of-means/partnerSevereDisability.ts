import { IsDefined, IsIn } from '@hmcts/class-validator'

export class ValidationErrors {
  static readonly OPTION_REQUIRED: string = 'Choose option: yes or no'
}

export class PartnerSevereDisabilityOption {
  static readonly YES = 'yes'
  static readonly NO = 'no'

  static all (): string[] {
    return [
      PartnerSevereDisabilityOption.YES,
      PartnerSevereDisabilityOption.NO
    ]
  }
}

export class PartnerSevereDisability {
  @IsDefined({ message: ValidationErrors.OPTION_REQUIRED })
  @IsIn(PartnerSevereDisabilityOption.all(), { message: ValidationErrors.OPTION_REQUIRED })
  option?: string

  constructor (option?: string) {
    this.option = option
  }
}
