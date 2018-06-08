import { LocalDate } from 'forms/models/localDate'
import { PaymentSchedule } from 'ccj/form/models/paymentSchedule'
import { Fractions, IsLessThan, IsValidLocalDate } from '@hmcts/cmc-validators'
import { IsDefined, IsIn, IsPositive, ValidateNested } from 'class-validator'
import { IsFutureDate } from 'forms/validation/validators/dateFutureConstraint'
import { ValidationErrors as CommonValidationErrors } from 'forms/validation/validationErrors'
import { toNumberOrUndefined } from 'shared/utils/numericUtils'

export class ValidationErrors {
  static readonly INSTALMENTS_AMOUNT_INVALID: string = 'Enter a valid amount for equal instalments'
  static readonly INVALID_DATE: string = 'Enter a valid first payment date'
  static readonly FUTURE_DATE: string = 'Enter a first payment date in the future'
  static readonly SELECT_PAYMENT_SCHEDULE: string = 'Select how often you wish to pay'
}

export class DefendantPaymentPlan {

  totalAmount?: number

  @IsPositive({ message: ValidationErrors.INSTALMENTS_AMOUNT_INVALID })
  @IsLessThan('totalAmount', { message: ValidationErrors.INSTALMENTS_AMOUNT_INVALID })
  @Fractions(0, 2, { message: CommonValidationErrors.AMOUNT_INVALID_DECIMALS })
  instalmentAmount?: number

  @ValidateNested()
  @IsDefined({ message: ValidationErrors.INVALID_DATE })
  @IsValidLocalDate({ message: ValidationErrors.INVALID_DATE })
  @IsFutureDate({ message: ValidationErrors.FUTURE_DATE })
  firstPaymentDate?: LocalDate

  @IsIn(PaymentSchedule.all(), { message: ValidationErrors.SELECT_PAYMENT_SCHEDULE })
  paymentSchedule?: PaymentSchedule

  constructor (totalAmount?: number,
               instalmentAmount?: number,
               firstPaymentDate?: LocalDate,
               paymentSchedule?: PaymentSchedule
              ) {
    this.totalAmount = totalAmount
    this.instalmentAmount = instalmentAmount
    this.firstPaymentDate = firstPaymentDate
    this.paymentSchedule = paymentSchedule
  }

  static fromObject (value?: any): DefendantPaymentPlan {
    if (!value) {
      return undefined
    }

    return new DefendantPaymentPlan(
      toNumberOrUndefined(value.totalAmount),
      toNumberOrUndefined(value.instalmentAmount),
      LocalDate.fromObject(value.firstPaymentDate),
      value.paymentSchedule ? PaymentSchedule.of(value.paymentSchedule) : undefined)
  }

  deserialize (input?: any): DefendantPaymentPlan {
    if (input) {
      this.totalAmount = input.totalAmount
      this.instalmentAmount = input.instalmentAmount
      this.firstPaymentDate = new LocalDate().deserialize(input.firstPaymentDate)
      this.paymentSchedule = input.paymentSchedule ? PaymentSchedule.of(input.paymentSchedule.value) : undefined
    }
    return this
  }
}
