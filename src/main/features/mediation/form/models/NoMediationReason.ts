import { IsDefined, IsIn, MaxLength, ValidateIf } from '@hmcts/class-validator'
import { CompletableTask } from 'models/task'
import { NoMediationReasonOptions } from 'mediation/form/models/NoMediationReasonOptions'

export class ValidationErrors {
  static readonly OPTION_REQUIRED: string = 'Please select one reason'
  static readonly TEXT_TOO_LONG: string = 'Reason must be 500 characters or fewer'
}

export class NoMediationReason implements CompletableTask {
  @IsDefined({ message: ValidationErrors.OPTION_REQUIRED })
  @IsIn(NoMediationReasonOptions.all(), { message: ValidationErrors.OPTION_REQUIRED })
  iDoNotWantMediationReason?: string

  @ValidateIf(o => o.iDoNotWantMediationReason === NoMediationReasonOptions.OTHER)
  @MaxLength(500, { message: ValidationErrors.TEXT_TOO_LONG })
  otherReason?: string

  constructor (iDoNotWantMediationReason?: string, otherReason?: string) {
    this.iDoNotWantMediationReason = iDoNotWantMediationReason
    this.otherReason = otherReason
  }

  static fromObject (value?: any): NoMediationReason {
    if (!value) {
      return value
    }

    return new NoMediationReason(value.iDoNotWantMediationReason, value.otherReason)
  }

  deserialize (input?: any): NoMediationReason {
    if (input && input.iDoNotWantMediationReason) {
      this.iDoNotWantMediationReason = input.iDoNotWantMediationReason
      this.otherReason = input.otherReason
    }
    return this
  }

  isCompleted (): boolean {
    return true
  }
}
