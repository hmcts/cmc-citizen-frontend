import { MomentFactory } from 'shared/momentFactory'

export const ccjIssueRequestPayImmediately = {
  defendantDateOfBirth: MomentFactory.parse('1999-01-01').utc(true),
  paidAmount: undefined,
  paymentOption: 'IMMEDIATELY',
  payBySetDate:  MomentFactory.currentDate().add(5, 'days'),
  repaymentPlan: undefined,
  statementOfTruth: undefined
}
export const ccjIssueRequestPayBySetDate = {
  defendantDateOfBirth: MomentFactory.parse('1999-01-01').utc(true),
  paidAmount: undefined,
  paymentOption: 'BY_SPECIFIED_DATE',
  payBySetDate: MomentFactory.parse('2050-12-31').utc(true),
  repaymentPlan: undefined,
  statementOfTruth: undefined
}
export const ccjIssueRequestPayByInstalments = {
  defendantDateOfBirth: MomentFactory.parse('1999-01-01').utc(true),
  paymentOption: 'INSTALMENTS',
  repaymentPlan: {
    instalmentAmount: 100,
    firstPaymentDate: MomentFactory.parse('2050-12-31').utc(true),
    paymentSchedule: 'EACH_WEEK'
  },
  statementOfTruth: undefined
}
export const ccjIssueRequestPayImmediatelyForCompany = {
  defendantDateOfBirth: undefined,
  paidAmount: undefined,
  paymentOption: 'IMMEDIATELY',
  payBySetDate: MomentFactory.currentDate().add(5, 'days'),
  repaymentPlan: undefined,
  statementOfTruth: undefined
}
export const ccjIssueRequestPayBySetDateForCompany = {
  defendantDateOfBirth: undefined,
  paidAmount: undefined,
  paymentOption: 'BY_SPECIFIED_DATE',
  payBySetDate: MomentFactory.parse('2050-12-31').utc(true),
  repaymentPlan: undefined,
  statementOfTruth: undefined
}
export const ccjIssueRequestPayByInstalmentsForCompany = {
  defendantDateOfBirth: undefined,
  paymentOption: 'INSTALMENTS',
  repaymentPlan: {
    instalmentAmount: 100,
    firstPaymentDate: MomentFactory.parse('2050-12-31').utc(true),
    paymentSchedule: 'EACH_WEEK'
  },
  statementOfTruth: undefined
}
