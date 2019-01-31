import { IsDefined, IsIn } from '@hmcts/class-validator'
import { CompletableTask } from 'models/task'

export class InterestTypeOption {
  static readonly SAME_RATE = 'same'
  static readonly BREAKDOWN = 'breakdown'

  static all (): string[] {
    return [
      InterestTypeOption.SAME_RATE,
      InterestTypeOption.BREAKDOWN
    ]
  }
}

export class ValidationErrors {
  static readonly INTEREST_TYPE_REQUIRED: string = 'Choose same rate or breakdown'
}

export class InterestType implements CompletableTask {

  @IsDefined({ message: ValidationErrors.INTEREST_TYPE_REQUIRED })
  @IsIn(InterestTypeOption.all(), { message: ValidationErrors.INTEREST_TYPE_REQUIRED })
  option?: string

  constructor (option?: string) {
    this.option = option
  }

  static fromObject (value?: any): InterestType {
    if (value == null) {
      return value
    }

    return new InterestType(value.option)
  }

  deserialize (input?: any): InterestType {
    if (input) {
      this.option = input.option
    }

    return this
  }

  isCompleted (): boolean {
    return !!this.option && (this.option === InterestTypeOption.SAME_RATE || this.option === InterestTypeOption.BREAKDOWN)
  }
}
