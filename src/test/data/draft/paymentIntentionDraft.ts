import { MomentFactory } from 'shared/momentFactory'
import { PaymentSchedule } from 'claims/models/response/core/paymentSchedule'
import { PaymentOption } from 'claims/models/paymentOption'

export const intentionOfImmediatePayment = {
  paymentOption: PaymentOption.IMMEDIATELY
}

export const intentionOfPaymentInFullBySetDate = {
  paymentOption: PaymentOption.BY_SPECIFIED_DATE,
  paymentDate: MomentFactory.parse('2018-12-31')
}

export const intentionOfPaymentByInstalments = {
  paymentOption: PaymentOption.INSTALMENTS,
  repaymentPlan: {
    instalmentAmount: 100,
    firstPaymentDate: MomentFactory.parse('2018-12-31'),
    paymentSchedule: PaymentSchedule.EVERY_MONTH,
    completionDate: MomentFactory.parse('2019-12-30'),
    paymentLength: ''
  }
}
