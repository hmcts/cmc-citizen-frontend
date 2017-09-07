import { LocalDate } from 'forms/models/localDate'
import { PaymentSchedule } from 'ccj/form/models/paymentSchedule'

export class RepaymentPlan {
  firstPayment?: number
  installmentAmount?: number
  firstPaymentDate?: LocalDate
  paymentSchedule?: PaymentSchedule


  constructor (firstPayment?: number, installmentAmount?: number, firstPaymentDate?: LocalDate, paymentSchedule?: PaymentSchedule) {
    this.firstPayment = firstPayment
    this.installmentAmount = installmentAmount
    this.firstPaymentDate = firstPaymentDate
    this.paymentSchedule = paymentSchedule
  }

  static fromObject (value?: any): RepaymentPlan {
    if (value && value.option) {
      const firstPayment = value.firstPayment ? parseFloat(value.firstPayment) : undefined
      const installmentAmount = value.installmentAmount ? parseFloat(value.installmentAmount) : undefined
      const firstPaymentDate = new LocalDate(
        value.firstPaymentDate.year,
        value.firstPaymentDate.month,
        value.firstPaymentDate.day
      )
      const option = PaymentSchedule.all()
        .filter(option => option.value === value.paymentSchedule.value)
        .pop()
      return new RepaymentPlan(firstPayment, installmentAmount, firstPaymentDate, option)
    } else {
      return new RepaymentPlan()
    }
  }

  deserialize (input?: any): RepaymentPlan {
    if (input) {
      this.firstPayment = input.firstPayment
      this.installmentAmount = input.installmentAmount
      this.firstPaymentDate = new LocalDate().deserialize(input.firstPaymentDate)
      this.paymentSchedule =  PaymentSchedule.all()
        .filter(option => option.value === input.paymentSchedule.value)
        .pop()
    }

    return this
  }
}
