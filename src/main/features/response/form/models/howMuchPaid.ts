import { Serializable } from 'models/serializable'
import { IsDefined, IsPositive, MaxLength } from 'class-validator'
import { IsPastDate } from 'forms/validation/validators/datePastConstraint'
import { LocalDate } from 'forms/models/localDate'
import { IsNotBlank } from 'app/forms/validation/validators/isBlank'

export class ValidationErrors {
  static readonly NOT_OWE_FULL_AMOUNT_REQUIRED: string = 'You haven’t explained why you don’t owe the full amount'
  static readonly REASON_NOT_OWE_MONEY_TOO_LONG: string = 'Enter reason no longer than $constraint1 characters'
  static readonly VALID_AMOUNT_REQUIRED: string = 'Enter a valid amount paid'
  static readonly AMOUNT_REQUIRED: string = 'Enter an amount'
  static readonly DATE_REQUIRED: string = 'Enter a date'
  static readonly VALID_PAST_DATE: string = 'Enter a valid date in the past'
}

export class HowMuchPaid implements Serializable<HowMuchPaid> {

  @IsDefined({ message: ValidationErrors.AMOUNT_REQUIRED })
  @IsPositive({ message: ValidationErrors.VALID_AMOUNT_REQUIRED })
  amount?: number
  @IsDefined({ message: ValidationErrors.DATE_REQUIRED })
  @IsPastDate({ message: ValidationErrors.VALID_PAST_DATE })
  date?: LocalDate
  @IsDefined({ message: ValidationErrors.NOT_OWE_FULL_AMOUNT_REQUIRED })
  @IsNotBlank({ message: ValidationErrors.NOT_OWE_FULL_AMOUNT_REQUIRED })
  @MaxLength(99000, { message: ValidationErrors.REASON_NOT_OWE_MONEY_TOO_LONG })
  text?: string
  constructor (amount?: number, date?: LocalDate, text?: string) {
    this.amount = amount
    this.date = date
    this.text = text
  }

  static fromObject (value?: any): HowMuchPaid {
    if (value) {
      const amount = value.amount ? parseFloat(value.amount) : undefined
      const pastDate = LocalDate.fromObject(value.date)
      const text = value.text
      return new HowMuchPaid(amount, pastDate, text)
    }else {
      return new HowMuchPaid()
    }
  }
  deserialize (input: any): HowMuchPaid {
    if (input) {
      this.amount = input.amount
      this.date = new LocalDate().deserialize(input.date)
      this.text = input.text
    }
    return this
  }

  isCompleted (): boolean {
    return !!this.date.year && this.date.year.toString().length > 0
  }}
