import { IsDefined, IsIn } from '@hmcts/class-validator'

export class ValidationErrors {
  static readonly OPTION_REQUIRED: string = 'Choose option: yes or no'
}

export class DependantsDisabilityOption {
  static readonly YES = 'yes'
  static readonly NO = 'no'

  static all (): string[] {
    return [
      DependantsDisabilityOption.YES,
      DependantsDisabilityOption.NO
    ]
  }
}

export class DependantsDisability {
  @IsDefined({ message: ValidationErrors.OPTION_REQUIRED })
  @IsIn(DependantsDisabilityOption.all(), { message: ValidationErrors.OPTION_REQUIRED })
  option?: string

  constructor (option?: string) {
    this.option = option
  }
}
