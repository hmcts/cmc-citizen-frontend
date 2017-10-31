import { LocalDate } from 'forms/models/localDate'
import { PaymentSchedule } from 'ccj/form/models/paymentSchedule'
import { IsDefined, IsIn, IsPositive, ValidateNested } from 'class-validator'
import { IsValidYearFormat } from 'forms/validation/validators/isValidYearFormat'
import { IsValidLocalDate } from 'forms/validation/validators/isValidLocalDate'
import { IsFutureDate } from 'app/forms/validation/validators/dateFutureConstraint'
import { IsLessThanOrEqualToSumOf } from 'forms/validation/validators/isLessThanOrEqualToSumOf'
import { Fractions } from 'forms/validation/validators/fractions'

export class ValidationErrors {
  static readonly FIRST_PAYMENT_AMOUNT_INVALID: string = 'Enter a valid amount of first payment'
  static readonly INSTALMENTS_AMOUNT_INVALID: string = 'Enter a valid amount for equal instalments'
  static readonly FUTURE_DATE: string = 'Enter a first payment date in the future'
  static readonly INVALID_DATE: string = 'Enter a valid date of first payment'
  static readonly SELECT_PAYMENT_SCHEDULE: string = 'Select how often they should pay'
  static readonly AMOUNT_INVALID_DECIMALS: string = 'Enter valid amount, maximum two decimal places'
}

export class DefendantPaymentPlan {

  remainingAmount?: number

  @IsPositive({ message: ValidationErrors.FIRST_PAYMENT_AMOUNT_INVALID })
  @IsLessThanOrEqualToSumOf('installmentAmount', 'remainingAmount', { message: ValidationErrors.FIRST_PAYMENT_AMOUNT_INVALID })
  @Fractions(0, 2, { message: ValidationErrors.AMOUNT_INVALID_DECIMALS })
  firstPayment?: number

  @IsPositive({ message: ValidationErrors.INSTALMENTS_AMOUNT_INVALID })
  @IsLessThanOrEqualToSumOf('firstPayment', 'remainingAmount', { message: ValidationErrors.INSTALMENTS_AMOUNT_INVALID })
  @Fractions(0, 2, { message: ValidationErrors.AMOUNT_INVALID_DECIMALS })
  installmentAmount?: number

  @ValidateNested()
  @IsDefined({ message: ValidationErrors.INVALID_DATE })
  @IsValidLocalDate({ message: ValidationErrors.INVALID_DATE })
  @IsValidYearFormat({ message: ValidationErrors.INVALID_DATE })
  @IsFutureDate({ message: ValidationErrors.FUTURE_DATE })
  firstPaymentDate?: LocalDate

  @IsIn(PaymentSchedule.all(), { message: ValidationErrors.SELECT_PAYMENT_SCHEDULE })
  paymentSchedule?: PaymentSchedule

  constructor (
    remainingAmount?: number,
    firstPayment?: number,
    installmentAmount?: number,
    firstPaymentDate?: LocalDate,
    paymentSchedule?: PaymentSchedule
  ) {
    this.remainingAmount = remainingAmount
    this.firstPayment = firstPayment
    this.installmentAmount = installmentAmount
    this.firstPaymentDate = firstPaymentDate
    this.paymentSchedule = paymentSchedule
  }

  static fromObject (value?: any): DefendantPaymentPlan {
    if (value) {
      const remainingAmount = value.remainingAmount ? parseFloat(value.remainingAmount) : undefined
      const firstPayment = value.firstPayment ? parseFloat(value.firstPayment) : undefined
      const installmentAmount = value.installmentAmount ? parseFloat(value.installmentAmount) : undefined
      const firstPaymentDate = LocalDate.fromObject(value.firstPaymentDate)

      const paymentSchedule = PaymentSchedule.all()
        .filter(option => option.value === value.paymentSchedule)
        .pop()
      return new DefendantPaymentPlan(remainingAmount, firstPayment, installmentAmount, firstPaymentDate, paymentSchedule)
    } else {
      return new DefendantPaymentPlan()
    }
  }

  deserialize (input?: any): DefendantPaymentPlan {
    if (input) {
      this.remainingAmount = input.remainingAmount
      this.firstPayment = input.firstPayment
      this.installmentAmount = input.installmentAmount
      this.firstPaymentDate = new LocalDate().deserialize(input.firstPaymentDate)
      this.paymentSchedule = PaymentSchedule.all()
        .filter(option => input.paymentSchedule && option.value === input.paymentSchedule.value)
        .pop()
    }

    return this
  }
}
