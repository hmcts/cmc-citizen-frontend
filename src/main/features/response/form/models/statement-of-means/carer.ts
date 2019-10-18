import { IsDefined, IsIn } from '@hmcts/class-validator'

export class ValidationErrors {
  static readonly OPTION_REQUIRED: string = 'Choose option: yes or no'
}

export class CarerOption {
  static readonly YES = 'yes'
  static readonly NO = 'no'

  static all (): string[] {
    return [
      CarerOption.YES,
      CarerOption.NO
    ]
  }
}

export class Carer {
  @IsDefined({ message: ValidationErrors.OPTION_REQUIRED })
  @IsIn(CarerOption.all(), { message: ValidationErrors.OPTION_REQUIRED })
  option?: string

  constructor (option?: string) {
    this.option = option
  }
}
