import { MomentFactory } from 'shared/momentFactory'

export const ccjIssueRequestPayImmediately = {
  defendantDateOfBirth: '1999-01-01T00:00:00.000Z',
  paidAmount: undefined,
  paymentOption: 'IMMEDIATELY',
  payBySetDate:  MomentFactory.currentDate().add(5, 'days'),
  repaymentPlan: undefined,
  statementOfTruth: undefined
}
export const ccjIssueRequestPayBySetDate = {
  defendantDateOfBirth: '1999-01-01T00:00:00.000Z',
  paidAmount: undefined,
  paymentOption: 'BY_SPECIFIED_DATE',
  payBySetDate: '2050-12-31T00:00:00.000Z',
  repaymentPlan: undefined,
  statementOfTruth: undefined
}
export const ccjIssueRequestPayByInstalments = {
  defendantDateOfBirth: '1999-01-01T00:00:00.000Z',
  paymentOption: 'INSTALMENTS',
  repaymentPlan: {
    instalmentAmount: 100,
    firstPaymentDate: '2050-12-31T00:00:00.000Z',
    paymentSchedule: 'EACH_WEEK'
  },
  statementOfTruth: undefined
}
export const ccjIssueRequestPayImmediatelyForCompany = {
  defendantDateOfBirth: undefined,
  paidAmount: undefined,
  paymentOption: 'IMMEDIATELY',
  payBySetDate: MomentFactory.currentDate().add(5, 'days'), // '2050-12-31T00:00:00.000Z',
  repaymentPlan: undefined,
  statementOfTruth: undefined
}
export const ccjIssueRequestPayBySetDateForCompany = {
  defendantDateOfBirth: undefined,
  paidAmount: undefined,
  paymentOption: 'BY_SPECIFIED_DATE',
  payBySetDate: '2050-12-31T00:00:00.000Z',
  repaymentPlan: undefined,
  statementOfTruth: undefined
}
export const ccjIssueRequestPayByInstalmentsForCompany = {
  defendantDateOfBirth: undefined,
  paymentOption: 'INSTALMENTS',
  repaymentPlan: {
    instalmentAmount: 100,
    firstPaymentDate: '2050-12-31T00:00:00.000Z',
    paymentSchedule: 'EACH_WEEK'
  },
  statementOfTruth: undefined
}
