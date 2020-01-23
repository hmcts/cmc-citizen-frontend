import { IsDefined, IsIn } from '@hmcts/class-validator'
import { CompletableTask } from 'models/task'

export class InterestEndDateOption {
  static readonly SUBMISSION = 'submission'
  static readonly SETTLED_OR_JUDGMENT = 'settled_or_judgment'

  static all (): string[] {
    return [
      InterestEndDateOption.SUBMISSION,
      InterestEndDateOption.SETTLED_OR_JUDGMENT
    ]
  }
}

export class ValidationErrors {
  static readonly INTEREST_END_DATE_REQUIRED: string = 'Choose when you want to stop claiming interest'
}

export class InterestEndDate implements CompletableTask {

  @IsDefined({ message: ValidationErrors.INTEREST_END_DATE_REQUIRED })
  @IsIn(InterestEndDateOption.all(), { message: ValidationErrors.INTEREST_END_DATE_REQUIRED })
  option?: string

  constructor (option?: string) {
    this.option = option
  }

  static fromObject (value?: any): InterestEndDate {
    if (value == null) {
      return value
    }

    return new InterestEndDate(value.option)
  }

  deserialize (input?: any): InterestEndDate {
    if (input) {
      this.option = input.option
    }

    return this
  }

  isCompleted (): boolean {
    return !!this.option && (this.option === InterestEndDateOption.SETTLED_OR_JUDGMENT || this.option === InterestEndDateOption.SUBMISSION)
  }
}
