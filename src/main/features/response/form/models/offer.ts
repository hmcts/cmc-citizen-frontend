import { MaxLength, IsDefined, ValidateNested } from 'class-validator'
import { Serializable } from 'models/serializable'
import { IsNotBlank } from 'app/forms/validation/validators/isBlank'
import { IsFutureDate } from 'forms/validation/validators/dateFutureConstraint'
import { LocalDate } from 'forms/models/localDate'
import { IsValidLocalDate } from 'forms/validation/validators/isValidLocalDate'
import { IsValidYearFormat } from 'app/forms/validation/validators/isValidYearFormat'

export class ValidationErrors {
  static readonly DATE_REQUIRED: string = 'Please enter a valid date'
  static readonly DATE_NOT_VALID: string = 'Please enter a valid date'
  static readonly DATE_INVALID_YEAR: string = 'Enter a 4 digit year'
  static readonly FUTURE_DATE: string = 'Enter a offer date in the future'
  static readonly OFFER_REQUIRED: string = "You haven't made your offer"
  static readonly OFFER_TEXT_TOO_LONG: string = 'Enter offer no longer than $constraint1 characters'
}

export default class Offer implements Serializable<Offer> {
  @IsDefined({ message: ValidationErrors.OFFER_REQUIRED })
  @IsNotBlank({ message: ValidationErrors.OFFER_REQUIRED })
  @MaxLength(99000, { message: ValidationErrors.OFFER_TEXT_TOO_LONG })
  text?: string

  @ValidateNested()
  @IsDefined({ message: ValidationErrors.DATE_REQUIRED })
  @IsValidLocalDate({ message: ValidationErrors.DATE_NOT_VALID })
  @IsValidYearFormat({ message: ValidationErrors.DATE_INVALID_YEAR })
  @IsFutureDate({ message: ValidationErrors.FUTURE_DATE })
  date?: LocalDate

  constructor (text?: string, date?: LocalDate) {
    this.text = text
    this.date = date
  }

  static fromObject (value?: any): Offer {
    if (!value) {
      return value
    }
    const offer = new Offer(value.text, LocalDate.fromObject(value.date))
    return offer
  }

  deserialize (input: any): Offer {
    if (input) {
      this.text = input.text
      this.date = new LocalDate().deserialize(input.date)
    }
    return this
  }
}
