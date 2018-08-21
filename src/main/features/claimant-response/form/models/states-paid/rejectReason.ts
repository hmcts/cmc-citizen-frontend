import { IsDefined, MaxLength } from 'class-validator'
import { ValidationConstraints } from 'forms/validation/validationConstraints'
import { ValidationErrors as DefaultValidationErrors } from 'forms/validation/validationErrors'
import { IsNotBlank } from '@hmcts/cmc-validators'

export class RejectReason {

  static readonly EXPLAIN_WHY_YOU_REJECT_RESPONSE: string = 'Explain why you reject their response'
  @IsDefined({ message: RejectReason.EXPLAIN_WHY_YOU_REJECT_RESPONSE })
  @IsNotBlank({ message: RejectReason.EXPLAIN_WHY_YOU_REJECT_RESPONSE })
  @MaxLength(ValidationConstraints.FREE_TEXT_MAX_LENGTH, { message: DefaultValidationErrors.TEXT_TOO_LONG })
  reason?: string

  constructor (reason?: string) {
    this.reason = reason
  }

  static fromObject (input?: any): RejectReason {
    if (input == null) {
      return input
    }

    return new RejectReason(input.reason)
  }

  deserialize (input?: any): RejectReason {
    if (input && input.reason) {
      this.reason = input.reason
    }

    return this
  }
}
