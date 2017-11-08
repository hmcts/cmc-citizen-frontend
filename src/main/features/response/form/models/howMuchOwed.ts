import { Serializable } from 'models/serializable'
import { IsDefined, IsPositive, MaxLength } from 'class-validator'
import { IsNotBlank } from 'app/forms/validation/validators/isBlank'
import { ValidationErrors } from 'forms/validation/validationErrors'
import { Fractions } from 'forms/validation/validators/fractions'
import { ValidationConstraints } from 'forms/validation/validationConstraints'

export class HowMuchOwed implements Serializable<HowMuchOwed> {

  @IsDefined({ message: ValidationErrors.AMOUNT_REQUIRED })
  @IsPositive({ message: ValidationErrors.VALID_OWED_AMOUNT_REQUIRED })
  @Fractions(0, 2, { message: ValidationErrors.AMOUNT_INVALID_DECIMALS })
  amount?: number
  @IsDefined({ message: ValidationErrors.NOT_OWE_FULL_AMOUNT_REQUIRED })
  @IsNotBlank({ message: ValidationErrors.NOT_OWE_FULL_AMOUNT_REQUIRED })
  @MaxLength(ValidationConstraints.FREE_TEXT_MAX_LENGTH, { message: ValidationErrors.FREE_TEXT_TOO_LONG })
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
    } else {
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
