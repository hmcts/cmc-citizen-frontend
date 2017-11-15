import { LocalDate } from 'forms/models/localDate'
import { PaymentSchedule } from 'ccj/form/models/paymentSchedule'
import { IsDefined, IsIn, IsPositive, ValidateNested, MaxLength } from 'class-validator'
import { IsValidYearFormat } from 'forms/validation/validators/isValidYearFormat'
import { IsValidLocalDate } from 'forms/validation/validators/isValidLocalDate'
import { IsFutureDate } from 'app/forms/validation/validators/dateFutureConstraint'
import { IsLessThanOrEqualToSumOf } from 'forms/validation/validators/isLessThanOrEqualToSumOf'
import { Fractions } from 'forms/validation/validators/fractions'
import { ValidationErrors, RepaymentValidationErrors } from 'app/forms/validation/validationErrors'
import { ValidationConstraints } from 'app/forms/validation/validationConstraints'

export class DefendantPaymentPlan {

  remainingAmount?: number

  @IsPositive({ message: RepaymentValidationErrors.FIRST_PAYMENT_AMOUNT_INVALID })
  @IsLessThanOrEqualToSumOf('installmentAmount', 'remainingAmount', { message: RepaymentValidationErrors.FIRST_PAYMENT_AMOUNT_INVALID })
  @Fractions(0, 2, { message: ValidationErrors.AMOUNT_INVALID_DECIMALS })
  firstPayment?: number

  @IsPositive({ message: RepaymentValidationErrors.INSTALMENTS_AMOUNT_INVALID })
  @IsLessThanOrEqualToSumOf('firstPayment', 'remainingAmount', { message: RepaymentValidationErrors.INSTALMENTS_AMOUNT_INVALID })
  @Fractions(0, 2, { message: ValidationErrors.AMOUNT_INVALID_DECIMALS })
  installmentAmount?: number

  @ValidateNested()
  @IsDefined({ message: RepaymentValidationErrors.INVALID_DATE })
  @IsValidLocalDate({ message: RepaymentValidationErrors.INVALID_DATE })
  @IsValidYearFormat({ message: RepaymentValidationErrors.INVALID_DATE })
  @IsFutureDate({ message: RepaymentValidationErrors.FUTURE_DATE })
  firstPaymentDate?: LocalDate

  @IsIn(PaymentSchedule.all(), { message: RepaymentValidationErrors.SELECT_PAYMENT_SCHEDULE })
  paymentSchedule?: PaymentSchedule

  @MaxLength(ValidationConstraints.FREE_TEXT_MAX_LENGTH, { message: ValidationErrors.NOT_OWE_FULL_AMOUNT_REQUIRED })
  text?: string

  constructor (
    remainingAmount?: number,
    firstPayment?: number,
    installmentAmount?: number,
    firstPaymentDate?: LocalDate,
    paymentSchedule?: PaymentSchedule,
    text?: string
  ) {
    this.remainingAmount = remainingAmount
    this.firstPayment = firstPayment
    this.installmentAmount = installmentAmount
    this.firstPaymentDate = firstPaymentDate
    this.paymentSchedule = paymentSchedule
    this.text = text
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
      const text = value.text
      return new DefendantPaymentPlan(remainingAmount, firstPayment, installmentAmount, firstPaymentDate, paymentSchedule, text)
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
      this.text = input.text
    }

    return this
  }
}
