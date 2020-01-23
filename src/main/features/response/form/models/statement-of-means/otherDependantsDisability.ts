import { IsDefined, IsIn } from '@hmcts/class-validator'

export class ValidationErrors {
  static readonly OPTION_REQUIRED: string = 'Choose option: yes or no'
}

export class OtherDependantsDisabilityOption {
  static readonly YES = 'yes'
  static readonly NO = 'no'

  static all (): string[] {
    return [
      OtherDependantsDisabilityOption.YES,
      OtherDependantsDisabilityOption.NO
    ]
  }
}

export class OtherDependantsDisability {
  @IsDefined({ message: ValidationErrors.OPTION_REQUIRED })
  @IsIn(OtherDependantsDisabilityOption.all(), { message: ValidationErrors.OPTION_REQUIRED })
  option?: string

  constructor (option?: string) {
    this.option = option
  }
}
