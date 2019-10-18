import { IsDefined, IsIn } from '@hmcts/class-validator'
import { CompletableTask } from 'models/task'

export class ValidationErrors {
  static readonly OPTION_REQUIRED: string = 'Choose option: yes or no'
}

export class FreeMediationOption {
  static readonly YES = 'yes'
  static readonly NO = 'no'

  static all (): string[] {
    return [
      FreeMediationOption.YES,
      FreeMediationOption.NO
    ]
  }
}

export class FreeMediation implements CompletableTask {
  @IsDefined({ message: ValidationErrors.OPTION_REQUIRED })
  @IsIn(FreeMediationOption.all(), { message: ValidationErrors.OPTION_REQUIRED })
  option?: string

  constructor (option?: string) {
    this.option = option
  }

  isCompleted (): boolean {
    return !!this.option
  }
}
