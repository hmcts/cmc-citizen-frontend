import { IsDefined, IsIn } from 'class-validator'
import { ValidationErrors } from 'forms/validation/validationErrors'

export class InterestOption {
  static readonly YES = 'yes'
  static readonly NO = 'no'

  static all (): string[] {
    return [
      InterestOption.YES,
      InterestOption.NO
    ]
  }
}

export class Interest {

  @IsDefined({ message: ValidationErrors.YES_NO_REQUIRED })
  @IsIn(InterestOption.all(), { message: ValidationErrors.YES_NO_REQUIRED })
  interest?: string

  constructor (interest?: string) {
    this.interest = interest
  }

  static fromObject (input?: any): Interest {
    return new Interest(input.interest)
  }

  deserialize (input?: any): Interest {
    if (input) {
      this.interest = input.interest
    }

    return this
  }
}
