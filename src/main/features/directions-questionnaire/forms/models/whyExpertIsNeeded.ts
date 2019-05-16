import { CompletableTask } from 'models/task'
import { IsDefined, IsNotEmpty, ValidateIf } from '@hmcts/class-validator'
import { YesNoOption } from 'models/yesNoOption'

export class ValidationErrors {
  static readonly REASON_REQUIRED: string = 'Explain why you believe an expert is needed'
}

export class WhyExpertIsNeeded implements CompletableTask {

  @ValidateIf(o => o.expertEvidence && o.expertEvidence.option === YesNoOption.YES.option)
  @IsNotEmpty({ message: ValidationErrors.REASON_REQUIRED })
  @IsDefined({ message: ValidationErrors.REASON_REQUIRED })
  explanation?: string

  constructor (explanation?: string) {
    this.explanation = explanation
  }

  static fromObject (input: any): WhyExpertIsNeeded {
    if (!input) {
      return input
    }

    return new WhyExpertIsNeeded(input.explanation)
  }

  deserialize (input: any): WhyExpertIsNeeded {
    if (input) {
      this.explanation = input.explanation
    }

    return this
  }

  isCompleted (): boolean {
    return this.explanation !== undefined
  }
}
