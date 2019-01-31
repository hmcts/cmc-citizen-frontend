import { LocalDate } from 'forms/models/localDate'
import { IsDefined, ValidateNested } from '@hmcts/class-validator'
import { ValidationErrors as CommonValidationErrors } from 'forms/validation/validationErrors'
import { IsNotBlank, IsValidLocalDate } from '@hmcts/cmc-validators'

class ValidationErrors {
  static readonly CLAIM_NUMBER_REQUIRED: string = 'Enter a claim number'
}

export class UpdateResponseDeadlineRequest {

  @IsNotBlank({ message: ValidationErrors.CLAIM_NUMBER_REQUIRED })
  claimNumber?: string

  @ValidateNested()
  @IsDefined({ message: CommonValidationErrors.DATE_REQUIRED })
  @IsValidLocalDate({ message: CommonValidationErrors.DATE_NOT_VALID })
  date?: LocalDate

  constructor (claimNumber?: string, date?: LocalDate) {
    this.claimNumber = claimNumber
    this.date = date
  }

  static fromObject (value?: any): UpdateResponseDeadlineRequest {
    if (!value) {
      return value
    }

    return new UpdateResponseDeadlineRequest(value.claimNumber, LocalDate.fromObject(value.date))
  }

}
