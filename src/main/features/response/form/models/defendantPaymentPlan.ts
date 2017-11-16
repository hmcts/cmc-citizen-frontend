import { LocalDate } from 'forms/models/localDate'
import { PaymentSchedule } from 'ccj/form/models/paymentSchedule'
import { MaxLength } from 'class-validator'
import { ValidationErrors } from 'app/forms/validation/validationErrors'
import { ValidationConstraints } from 'app/forms/validation/validationConstraints'
import { RepaymentPlan } from 'ccj/form/models/repaymentPlan'

export class DefendantPaymentPlan extends RepaymentPlan {

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
    super(remainingAmount, firstPayment, installmentAmount, firstPaymentDate, paymentSchedule)
    this.text = text
  }

  static fromObject (value?: any): DefendantPaymentPlan {
    if (value) {
      let deserialized = new DefendantPaymentPlan()
      Object.assign(deserialized, RepaymentPlan.fromObject(value))
      deserialized.text = value.text
      return deserialized
    }
  }

  deserialize (input?: any): DefendantPaymentPlan {
    if (input) {
      Object.assign(this, new RepaymentPlan().deserialize(input))
      this.text = input.text
    }

    return this
  }
}
