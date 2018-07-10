import { IsDefined, IsIn } from 'class-validator'
import { YesNoOption } from 'models/yesNoOption'

export class ValidationErrors {
  static readonly YES_NO_REQUIRED: string = 'Choose yes if you’ve paid the amount you believe you owe'
}

export class AlreadyPaid {
  @IsDefined({ message: ValidationErrors.YES_NO_REQUIRED })
  @IsIn(YesNoOption.all(), { message: ValidationErrors.YES_NO_REQUIRED })
  option?: YesNoOption

  constructor (option?: YesNoOption) {
    this.option = option
  }

  public static fromObject (input?: any): AlreadyPaid {
    if (!input) {
      return input
    }

    return new AlreadyPaid(YesNoOption.fromObject(input.option))
  }

  deserialize (input?: any): AlreadyPaid {
    if (input && input.option) {
      this.option = YesNoOption.fromObject(input.option && input.option)
    }

    return this
  }
}
