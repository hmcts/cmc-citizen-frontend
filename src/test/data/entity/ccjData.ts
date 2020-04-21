import { MomentFactory } from 'shared/momentFactory'

export const ccjDeterminationByInstalment = {
  ccjType: 'DETERMINATION',
  paidAmount: 10,
  paymentOption: 'INSTALMENTS',
  repaymentPlan: {
    paymentLength: '100 months',
    completionDate: '2028-04-01',
    paymentSchedule: 'EVERY_MONTH',
    firstPaymentDate: '2020-01-01',
    instalmentAmount: 1
  },
  defendantDateOfBirth: '2000-01-01'
}

export function ccjDeterminationBySpecifiedDate () {
  return {
    ccjType: 'DETERMINATION',
    payBySetDate: MomentFactory.currentDate().add(2, 'year'),
    paymentOption: 'BY_SPECIFIED_DATE',
    defendantDateOfBirth: '1999-01-01'
  }
}

export function ccjAdmissionBySpecifiedDate () {
  return {
    ccjType: 'ADMISSIONS',
    payBySetDate: MomentFactory.currentDate().add(2, 'year'),
    paymentOption: 'BY_SPECIFIED_DATE',
    defendantDateOfBirth: '1999-01-01'
  }
}
