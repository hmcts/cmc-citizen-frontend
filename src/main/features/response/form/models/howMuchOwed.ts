import { Serializable } from 'models/serializable'
import { IsDefined, IsPositive, MaxLength } from 'class-validator'
import { IsNotBlank } from 'app/forms/validation/validators/isBlank'

export class ValidationErrors {
  static readonly NOT_OWE_FULL_AMOUNT_REQUIRED: string = 'Explain why you don’t owe the full amount'
  static readonly REASON_NOT_OWE_MONEY_TOO_LONG: string = 'Enter reason no longer than $constraint1 characters'
  static readonly VALID_AMOUNT_REQUIRED: string = `Enter a valid amount`
  static readonly AMOUNT_REQUIRED: string = 'Enter an amount'
}

export class HowMuchOwed implements Serializable<HowMuchOwed> {

  @IsDefined({ message: ValidationErrors.AMOUNT_REQUIRED })
  @IsPositive({ message: ValidationErrors.VALID_AMOUNT_REQUIRED })
  amount?: number
  @IsDefined({ message: ValidationErrors.NOT_OWE_FULL_AMOUNT_REQUIRED })
  @IsNotBlank({ message: ValidationErrors.NOT_OWE_FULL_AMOUNT_REQUIRED })
  @MaxLength(99000, { message: ValidationErrors.REASON_NOT_OWE_MONEY_TOO_LONG })
  text?: string
  constructor (amount?: number, text?: string) {
    this.amount = amount
    this.text = text
  }

  static fromObject (value?: any): HowMuchOwed {
    if (value) {
      const amount = value.amount ? parseFloat(value.amount) : undefined
      const text = value.text
      return new HowMuchOwed(amount, text)
    }else {
      return new HowMuchOwed()
    }
  }
  deserialize (input: any): HowMuchOwed {
    if (input) {
      this.amount = input.amount
      this.text = input.text
    }
    return this
  }
}
