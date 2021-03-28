import { IsDefined, IsIn } from '@hmcts/class-validator'
import { CompletableTask } from 'models/task'

export class BreathingTypeOption {
  static readonly STANDARD = 'STANDARD_BS_ENTERED'
  static readonly MENTAL_HEALTH = 'MENTAL_BS_ENTERED'

  static all (): string[] {
    return [
      BreathingTypeOption.STANDARD,
      BreathingTypeOption.MENTAL_HEALTH
    ]
  }
}

export class ValidationErrors {
  static readonly TYPE_REQUIRED: string = 'You must select the Type before continuing'
}

export class BreathingType implements CompletableTask {

  @IsDefined({ message: ValidationErrors.TYPE_REQUIRED })
  @IsIn(BreathingTypeOption.all(), { message: ValidationErrors.TYPE_REQUIRED })
  option?: string

  constructor (option?: string) {
    this.option = option
  }

  static fromObject (value?: any): BreathingType {
    if (value == null) {
      return value
    }

    return new BreathingType(value.option)
  }

  deserialize (input?: any): BreathingType {
    if (input) {
      this.option = input.option
    }

    return this
  }

  isCompleted (): boolean {
    return !!this.option && (this.option === BreathingTypeOption.STANDARD || this.option === BreathingTypeOption.MENTAL_HEALTH)
  }
}
