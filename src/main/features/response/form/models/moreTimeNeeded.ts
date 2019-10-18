import { IsDefined, IsIn } from '@hmcts/class-validator'

export class ValidationErrors {
  static readonly OPTION_REQUIRED: string = 'Choose option: yes or no'
}

export class MoreTimeNeededOption {
  static readonly YES = 'yes'
  static readonly NO = 'no'

  static all (): string[] {
    return [
      MoreTimeNeededOption.YES,
      MoreTimeNeededOption.NO
    ]
  }
}

export class MoreTimeNeeded {
  @IsDefined({ message: ValidationErrors.OPTION_REQUIRED })
  @IsIn(MoreTimeNeededOption.all(), { message: ValidationErrors.OPTION_REQUIRED })
  option?: string

  constructor (option?: string) {
    this.option = option
  }
}
