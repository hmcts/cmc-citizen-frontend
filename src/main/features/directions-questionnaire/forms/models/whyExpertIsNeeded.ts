import { CompletableTask } from 'models/task'
import { IsDefined, IsNotEmpty, MaxLength } from '@hmcts/class-validator'
import { ValidationConstraints } from 'forms/validation/validationConstraints'
import { ValidationErrors as DefaultValidationErrors } from 'forms/validation/validationErrors'

export class ValidationErrors {
  static readonly REASON_REQUIRED: string = 'Explain why you believe an expert is needed'
}

export class WhyExpertIsNeeded implements CompletableTask {

  @IsNotEmpty({ message: ValidationErrors.REASON_REQUIRED })
  @IsDefined({ message: ValidationErrors.REASON_REQUIRED })
  @MaxLength(ValidationConstraints.FREE_TEXT_MAX_LENGTH, { message: DefaultValidationErrors.TEXT_TOO_LONG })
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
