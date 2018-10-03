import { LocalDate } from 'forms/models/localDate'
import { PaymentSchedule } from 'ccj/form/models/paymentSchedule'
import { Fractions, IsLessThan, IsValidLocalDate } from '@hmcts/cmc-validators'
import { IsDefined, IsIn, IsPositive, ValidateNested } from 'class-validator'
import { IsFutureDate } from 'forms/validation/validators/dateFutureConstraint'
import { ValidationErrors as CommonValidationErrors } from 'forms/validation/validationErrors'
import { toNumberOrUndefined } from 'shared/utils/numericUtils'
import { Moment } from 'moment'
import { PaymentPlan as PP } from 'common/payment-plan/paymentPlan'
import { Frequency } from 'common/frequency/frequency'

export class ValidationErrors {
  static readonly INSTALMENTS_AMOUNT_INVALID: string = 'Enter a valid amount for equal instalments'
  static readonly FIRST_PAYMENT_DATE_INVALID: string = 'Enter a valid first payment date'
  static readonly FIRST_PAYMENT_DATE_NOT_IN_FUTURE: string = 'Enter a first payment date in the future'
  static readonly SCHEDULE_REQUIRED: string = 'Choose a payment frequency'
}

export class PaymentPlan {

  totalAmount?: number

  @IsPositive({ message: ValidationErrors.INSTALMENTS_AMOUNT_INVALID, groups: ['default', 'claimant-suggestion'] })
  @IsLessThan('totalAmount', { message: ValidationErrors.INSTALMENTS_AMOUNT_INVALID, groups: ['default', 'claimant-suggestion'] })
  @Fractions(0, 2, { message: CommonValidationErrors.AMOUNT_INVALID_DECIMALS, groups: ['default', 'claimant-suggestion'] })
  instalmentAmount?: number

  @ValidateNested({ groups: ['default', 'claimant-suggestion'] })
  @IsDefined({ message: ValidationErrors.FIRST_PAYMENT_DATE_INVALID })
  @IsValidLocalDate({ message: ValidationErrors.FIRST_PAYMENT_DATE_INVALID })
  @IsFutureDate({ message: ValidationErrors.FIRST_PAYMENT_DATE_NOT_IN_FUTURE })
  firstPaymentDate?: LocalDate

  @IsIn(PaymentSchedule.all(), { message: ValidationErrors.SCHEDULE_REQUIRED })
  paymentSchedule?: PaymentSchedule

  completionDate?: Moment
  paymentLength?: string

  constructor (totalAmount?: number,
               instalmentAmount?: number,
               firstPaymentDate?: LocalDate,
               paymentSchedule?: PaymentSchedule
              ) {
    this.totalAmount = totalAmount
    this.instalmentAmount = instalmentAmount
    this.firstPaymentDate = firstPaymentDate
    this.paymentSchedule = paymentSchedule
    this.completionDate = this.paymentSchedule ? this.getCompletionDate() : undefined
    this.paymentLength = this.paymentSchedule ? this.getPaymentLength() : undefined
  }

  static fromObject (value?: any): PaymentPlan {
    if (!value) {
      return undefined
    }

    return new PaymentPlan(
      toNumberOrUndefined(value.totalAmount),
      toNumberOrUndefined(value.instalmentAmount),
      LocalDate.fromObject(value.firstPaymentDate),
      value.paymentSchedule ? PaymentSchedule.of(value.paymentSchedule) : undefined)
  }

  deserialize (input?: any): PaymentPlan {
    if (input) {
      this.totalAmount = input.totalAmount
      this.instalmentAmount = input.instalmentAmount
      this.firstPaymentDate = new LocalDate().deserialize(input.firstPaymentDate)
      this.paymentSchedule = input.paymentSchedule ? PaymentSchedule.of(input.paymentSchedule.value) : undefined
      this.completionDate = input.completionDate
      this.paymentLength = input.paymentLength
    }
    return this
  }

  getCompletionDate (): Moment {
    const paymentPlan = PP.create(this.totalAmount, this.instalmentAmount, Frequency.of(this.paymentSchedule.value), this.firstPaymentDate.toMoment())
    return paymentPlan.calculateLastPaymentDate()
  }

  getPaymentLength (): string {
    const paymentPlan = PP.create(this.totalAmount, this.instalmentAmount, Frequency.of(this.paymentSchedule.value), this.firstPaymentDate.toMoment())
    return paymentPlan.calculatePaymentLength()
  }
}
