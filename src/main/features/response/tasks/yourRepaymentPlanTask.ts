import { Validator } from 'class-validator'
import { DefendantPaymentPlan as PaymentPlan } from 'response/form/models/defendantPaymentPlan'

const validator = new Validator()

function isValid (input): boolean {
  return input !== undefined && validator.validateSync(input).length === 0
}

export class YourRepaymentPlanTask {
  static isCompleted (paymentPlan: PaymentPlan): boolean {
    return isValid(paymentPlan)
  }
}
