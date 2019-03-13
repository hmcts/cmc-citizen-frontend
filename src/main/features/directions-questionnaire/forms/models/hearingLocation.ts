import { IsDefined } from '@hmcts/class-validator'
import { ValidationErrors as GlobalValidationErrors } from 'forms/validation/validationErrors'
import { CompletableTask } from 'models/task'
import { YesNoOption } from 'models/yesNoOption'

export class HearingLocation implements CompletableTask {
  @IsDefined({ message: GlobalValidationErrors.YES_NO_REQUIRED })
  courtAccepted?: YesNoOption
  courtName?: string
  courtPostcode?: string
  alternativeCourtName?: string

  constructor (courtAccepted?: YesNoOption,
               courtName?: string,
               courtPostcode?: string,
               alternativeCourtName?: string) {
    this.courtAccepted = courtAccepted
    this.courtName = courtName
    this.courtPostcode = courtPostcode
    this.alternativeCourtName = alternativeCourtName
  }

  static fromObject (value?: any): HearingLocation {
    if (!value) {
      return value
    }

    return new HearingLocation(YesNoOption.fromObject(value.courtAccepted),
      value.courtName,
      value.courtPostcode,
      value.alternativeCourtName)
  }

  deserialize (input?: any): HearingLocation {
    if (input) {
      this.courtAccepted = input.courtAccepted
      this.courtName = input.courtName
      this.courtPostcode = input.courtPostcode
      this.alternativeCourtName = input.alternativeCourtName
    }
    return this
  }

  isCompleted (): boolean {
    return true
  }
}
