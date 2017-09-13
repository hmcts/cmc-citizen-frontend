import { LocalDate } from 'forms/models/localDate'
import { IsValidYearFormat } from 'forms/validation/validators/isValidYearFormat'
import { IsValidLocalDate } from 'forms/validation/validators/isValidLocalDate'
import { IsDefined, ValidateNested } from 'class-validator'
import { ValidationErrors as DateValidationErrors } from 'forms/models/interestDate'
import { IsNotBlank } from 'forms/validation/validators/isBlank'

class ValidationErrors {
  static readonly CLAIM_NUMBER_REQUIRED: string = 'Enter a claim number'
}

export class UpdateResponseDeadlineRequest {

  @IsNotBlank({ message: ValidationErrors.CLAIM_NUMBER_REQUIRED })
  claimNumber?: string

  @ValidateNested()
  @IsDefined({ message: DateValidationErrors.DATE_REQUIRED })
  @IsValidLocalDate({ message: DateValidationErrors.DATE_NOT_VALID })
  @IsValidYearFormat({ message: DateValidationErrors.DATE_INVALID_YEAR })
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
