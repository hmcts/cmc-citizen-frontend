import { LocalDate } from 'forms/models/localDate'
import { PaymentSchedule } from 'ccj/form/models/paymentSchedule'
import { IsDefined, IsIn, IsPositive, ValidateNested } from 'class-validator'
import { IsValidYearFormat } from 'forms/validation/validators/isValidYearFormat'
import { IsValidLocalDate } from 'forms/validation/validators/isValidLocalDate'
import { IsFutureDate } from 'app/forms/validation/validators/dateFutureConstraint'
import { IsLessThanOrEqualToSumOf } from 'forms/validation/validators/isLessThanOrEqualToSumOf'
import { Fractions } from 'forms/validation/validators/fractions'
import { ValidationErrors as CommonValidationErrors } from 'app/forms/validation/validationErrors'
import { toNumberOrUndefined } from 'common/utils/numericUtils'

export class ValidationErrors {
  static readonly FIRST_PAYMENT_AMOUNT_INVALID: string = 'Enter a valid payment amount'
  static readonly INSTALMENTS_AMOUNT_INVALID: string = 'Enter a valid amount for equal instalments'
  static readonly INVALID_DATE: string = 'Enter a valid first payment date'
  static readonly FUTURE_DATE: string = 'Enter a first payment date in the future'
  static readonly SELECT_PAYMENT_SCHEDULE: string = 'Select how often they should pay'
}

export class RepaymentPlan {

  remainingAmount?: number

  @IsPositive({ message: ValidationErrors.FIRST_PAYMENT_AMOUNT_INVALID })
  @IsLessThanOrEqualToSumOf('instalmentAmount', 'remainingAmount', { message: ValidationErrors.FIRST_PAYMENT_AMOUNT_INVALID })
  @Fractions(0, 2, { message: CommonValidationErrors.AMOUNT_INVALID_DECIMALS })
  firstPayment?: number

  @IsPositive({ message: ValidationErrors.INSTALMENTS_AMOUNT_INVALID })
  @IsLessThanOrEqualToSumOf('firstPayment', 'remainingAmount', { message: ValidationErrors.INSTALMENTS_AMOUNT_INVALID })
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
               firstPayment?: number,
               instalmentAmount?: number,
               firstPaymentDate?: LocalDate,
               paymentSchedule?: PaymentSchedule) {
    this.remainingAmount = remainingAmount
    this.firstPayment = firstPayment
    this.instalmentAmount = instalmentAmount
    this.firstPaymentDate = firstPaymentDate
    this.paymentSchedule = paymentSchedule
  }

  static fromObject (value?: any): RepaymentPlan {
    if (value) {
      const remainingAmount = toNumberOrUndefined(value.remainingAmount)
      const firstPayment = toNumberOrUndefined(value.firstPayment)
      const instalmentAmount = toNumberOrUndefined(value.instalmentAmount)
      const firstPaymentDate = LocalDate.fromObject(value.firstPaymentDate)

      const paymentSchedule = PaymentSchedule.all()
        .filter(option => option.value === value.paymentSchedule)
        .pop()
      return new RepaymentPlan(remainingAmount, firstPayment, instalmentAmount, firstPaymentDate, paymentSchedule)
    } else {
      return new RepaymentPlan()
    }
  }

  deserialize (input?: any): RepaymentPlan {
    if (input) {
      this.remainingAmount = input.remainingAmount
      this.firstPayment = input.firstPayment
      this.instalmentAmount = input.instalmentAmount
      this.firstPaymentDate = new LocalDate().deserialize(input.firstPaymentDate)
      this.paymentSchedule = PaymentSchedule.all()
        .filter(option => input.paymentSchedule && option.value === input.paymentSchedule.value)
        .pop()
    }

    return this
  }
}
