import { IsDefined, MaxLength } from '@hmcts/class-validator'
import { IsNotBlank } from '@hmcts/cmc-validators'
import { ValidationConstraints } from 'forms/validation/validationConstraints'
import { ValidationErrors as DefaultValidationErrors } from 'forms/validation/validationErrors'

export class ValidationErrors {
  static readonly EXPLAIN_WHY_YOU_REJECT_REPAYMENT_PLAN = 'Enter why you rejected repayment plan'
}
export class RejectionReason {
  @IsDefined({ message: ValidationErrors.EXPLAIN_WHY_YOU_REJECT_REPAYMENT_PLAN })
  @IsNotBlank({ message: ValidationErrors.EXPLAIN_WHY_YOU_REJECT_REPAYMENT_PLAN })
  @MaxLength(ValidationConstraints.FREE_TEXT_MAX_LENGTH, { message: DefaultValidationErrors.TEXT_TOO_LONG })
  text: string

  constructor (text?: string) {
    this.text = text
  }

  static fromObject (input?: any): RejectionReason {
    if (input == null) {
      return input
    }
    return new RejectionReason(input)
  }

  deserialize (input: any): RejectionReason {
    if (input) {
      this.text = input.text
    }
    return this
  }
}
