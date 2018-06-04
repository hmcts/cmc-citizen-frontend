import { LocalDate } from 'forms/models/localDate'
import { PaymentSchedule } from 'ccj/form/models/paymentSchedule'
import { IsDefined, IsIn, IsPositive, ValidateNested } from 'class-validator'
import { Fractions, IsLessThan } from '@hmcts/cmc-validators'
import { IsValidYearFormat } from 'forms/validation/validators/isValidYearFormat'
import { IsValidLocalDate } from 'forms/validation/validators/isValidLocalDate'
import { IsFutureDate } from 'forms/validation/validators/dateFutureConstraint'
import { ValidationErrors as CommonValidationErrors } from 'forms/validation/validationErrors'
import { toNumberOrUndefined } from 'shared/utils/numericUtils'

export class ValidationErrors {
  static readonly INSTALMENTS_AMOUNT_INVALID: string = 'Enter a valid amount for equal instalments'
  static readonly INVALID_DATE: string = 'Enter a valid first payment date'
  static readonly FUTURE_DATE: string = 'Enter a first payment date in the future'
  static readonly SELECT_PAYMENT_SCHEDULE: string = 'Select how often you wish to pay'
  static readonly WHY_NOT_OWE_FULL_AMOUNT_REQUIRED: string = 'Explain why you can’t pay the full amount now'
}

export class DefendantPaymentPlan {

  remainingAmount?: number

  @IsPositive({ message: ValidationErrors.INSTALMENTS_AMOUNT_INVALID })
  @IsLessThan('remainingAmount', { message: ValidationErrors.INSTALMENTS_AMOUNT_INVALID })
  @Fractions(0, 2, { message: CommonValidationErrors.AMOUNT_INVALID_DECIMALS })
  instalmentAmount?: number

  @ValidateNested()
  @IsDefined({ message: ValidationErrors.INVALID_DATE })
  @IsValidLocalDate({ message: ValidationErrors.INVALID_DATE })
  @IsValidYearFormat({ message: ValidationErrors.INVALID_DATE })
  @IsFutureDate({ message: ValidationErrors.FUTURE_DATE })
  firstPaymentDate?: LocalDate

  @IsIn(PaymentSchedule.all(), { message: ValidationErrors.SELECT_PAYMENT_SCHEDULE })
  paymentSchedule?: PaymentSchedule

  constructor (remainingAmount?: number,
               instalmentAmount?: number,
               firstPaymentDate?: LocalDate,
               paymentSchedule?: PaymentSchedule
              ) {
    this.remainingAmount = remainingAmount
    this.instalmentAmount = instalmentAmount
    this.firstPaymentDate = firstPaymentDate
    this.paymentSchedule = paymentSchedule
  }

  static fromObject (value?: any): DefendantPaymentPlan {
    if (!value) {
      return undefined
    }

    return new DefendantPaymentPlan(
      toNumberOrUndefined(value.remainingAmount),
      toNumberOrUndefined(value.instalmentAmount),
      LocalDate.fromObject(value.firstPaymentDate),
      value.paymentSchedule ? PaymentSchedule.of(value.paymentSchedule) : undefined )
  }

  deserialize (input?: any): DefendantPaymentPlan {
    if (input) {
      this.remainingAmount = input.remainingAmount
      this.instalmentAmount = input.instalmentAmount
      this.firstPaymentDate = new LocalDate().deserialize(input.firstPaymentDate)
      this.paymentSchedule = input.paymentSchedule ? PaymentSchedule.of(input.paymentSchedule.value) : undefined
    }
    return this
  }
}
