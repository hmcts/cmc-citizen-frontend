import { LocalDate } from 'forms/models/localDate'
import { PaymentSchedule } from 'ccj/form/models/paymentSchedule'
import { IsDefined, IsIn, IsPositive, ValidateNested } from 'class-validator'
import { isValidYearFormat } from 'forms/validation/validators/isValidYearFormat'
import { IsValidLocalDate } from 'forms/validation/validators/isValidLocalDate'
import { IsFutureDate } from 'app/forms/validation/validators/dateFutureConstraint'
import { IsLessThan } from 'forms/validation/validators/isLessThan'

export class ValidationErrors {
  static readonly FIRST_PAYMENT_AMOUNT_INVALID: string = 'Enter a valid amount of first payment'
  static readonly INSTALMENTS_AMOUNT_INVALID: string = 'Enter a valid amount for equal instalments'
  static readonly FUTURE_DATE: string = 'Enter a first payment date in the future'
  static readonly INVALID_DATE: string = 'Enter a valid date of first payment'
  static readonly SELECT_PAYMENT_SCHEDULE: string = 'Select how often they should pay'
}

export class RepaymentPlan {

  remainingAmount?: number

  @IsPositive({ message: ValidationErrors.FIRST_PAYMENT_AMOUNT_INVALID })
  @IsLessThan('remainingAmount', { message: ValidationErrors.FIRST_PAYMENT_AMOUNT_INVALID })
  firstPayment?: number

  @IsPositive({ message: ValidationErrors.INSTALMENTS_AMOUNT_INVALID })
  @IsLessThan('remainingAmount', { message: ValidationErrors.INSTALMENTS_AMOUNT_INVALID })
  installmentAmount?: number

  @ValidateNested()
  @IsDefined({ message: ValidationErrors.INVALID_DATE })
  @IsValidLocalDate({ message: ValidationErrors.INVALID_DATE })
  @isValidYearFormat(4, { message: ValidationErrors.INVALID_DATE })
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

  static fromObject (value?: any): RepaymentPlan {
    if (value) {
      const remainingAmount = value.remainingAmount ? parseFloat(value.remainingAmount) : undefined
      const firstPayment = value.firstPayment ? parseFloat(value.firstPayment) : undefined
      const installmentAmount = value.installmentAmount ? parseFloat(value.installmentAmount) : undefined
      const firstPaymentDate = LocalDate.fromObject(value.firstPaymentDate)

      const paymentSchedule = PaymentSchedule.all()
        .filter(option => option.value === value.paymentSchedule)
        .pop()
      return new RepaymentPlan(remainingAmount, firstPayment, installmentAmount, firstPaymentDate, paymentSchedule)
    } else {
      return new RepaymentPlan()
    }
  }

  deserialize (input?: any): RepaymentPlan {
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
