import { IsDefined, IsIn } from '@hmcts/class-validator'
import { InterestDateType } from 'common/interestDateType'

export class ValidationErrors {
  static readonly TYPE_REQUIRED: string = 'Choose when to claim interest from'
}

export class InterestDate {

  @IsDefined({ message: ValidationErrors.TYPE_REQUIRED })
  @IsIn(InterestDateType.all(), { message: ValidationErrors.TYPE_REQUIRED })
  type?: string

  constructor (type?: string) {
    this.type = type
  }

  static fromObject (value?: any): InterestDate {
    if (value == null) {
      return value
    }

    return new InterestDate(value.type)
  }

  deserialize (input?: any): InterestDate {
    if (input) {
      this.type = input.type
    }
    return this
  }
}
