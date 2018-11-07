import { PaymentOption } from 'claims/models/paymentOption'
import { MomentFactory } from 'shared/momentFactory'
import { PaymentSchedule } from 'claims/models/response/core/paymentSchedule'

export const paymentIntentionInInstallment = {
  paymentOption: PaymentOption.INSTALMENTS,
  paymentDate: MomentFactory.currentDate().add(5, 'days'),
  repaymentPlan: {
    instalmentAmount: 10,
    firstPaymentDate: MomentFactory.currentDate().add(30, 'days'),
    paymentSchedule: PaymentSchedule.EVERY_MONTH,
    completionDate: MomentFactory.currentDate().add(90, 'days'),
    paymentLength: '3 Months'
  }
}

export const paymentIntentionBySetDate = {
  paymentOption: PaymentOption.BY_SPECIFIED_DATE,
  paymentDate: MomentFactory.currentDate().add(90, 'days')
}

export const installmentPaymentIntention = {
  'paymentOption': 'INSTALMENTS',
  'paymentDate': MomentFactory.currentDate().add(5, 'days'),
  'repaymentPlan': {
    'instalmentAmount': 10,
    'firstPaymentDate': MomentFactory.currentDate().add(30, 'days'),
    'paymentSchedule': 'EVERY_MONTH',
    'completionDate': MomentFactory.currentDate().add(90, 'days'),
    'paymentLength': '3 Months'
  }
}

export const courtDecisionInstalments = {
  'courtDecision': installmentPaymentIntention
}

export const courtPaymentIntentionInstallments = {
  'courtPaymentIntention': installmentPaymentIntention
}

export const courtPaymentIntentionBySetDate = {
  'courtPaymentIntention': {
    'paymentOption': 'BY_SPECIFIED_DATE',
    'paymentDate': MomentFactory.currentDate().add(90, 'days'),
    'repaymentPlan': undefined
  }
}

export const courtDecisionBySetDate = {
  'courtDecision': {
    'paymentOption': 'BY_SPECIFIED_DATE',
    'paymentDate': MomentFactory.currentDate().add(90, 'days'),
    'repaymentPlan': undefined
  }
}

export const paymentIntentionByPayBySetDate = {
  paymentOption: PaymentOption.BY_SPECIFIED_DATE,
  paymentDate: MomentFactory.currentDate().add(90, 'days'),
  repaymentPlan: undefined
}
