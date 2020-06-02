import { PaymentOption } from 'claims/models/paymentOption'
import { PaymentSchedule } from 'claims/models/response/core/paymentSchedule'

import { AgeGroupType } from 'claims/models/response/statement-of-means/dependant'
import { ResidenceType } from 'claims/models/response/statement-of-means/residence'
import { BankAccountType } from 'claims/models/response/statement-of-means/bankAccount'

import { MomentFactory } from 'shared/momentFactory'
import { company, individual } from 'test/data/entity/party'
import { Income, IncomeType } from 'claims/models/response/statement-of-means/income'
import { Expense, ExpenseType } from 'claims/models/response/statement-of-means/expense'
import { PaymentFrequency } from 'claims/models/response/core/paymentFrequency'
import { DisabilityStatus } from 'claims/models/response/statement-of-means/disabilityStatus'
import { ResponseMethod } from 'claims/models/response/responseMethod'

export const baseResponseData = {
  defendant: individual,
  moreTimeNeeded: 'no',
  freeMediation: 'no',
  mediationPhoneNumber: undefined,
  mediationContactPerson: undefined,
  responseMethod: ResponseMethod.DIGITAL
}

const baseCompanyResponseData = {
  defendant: company,
  moreTimeNeeded: 'no'
}

export const baseDefenceData = {
  responseType: 'FULL_DEFENCE',
  defence: 'My defence',
  freeMediation: 'no',
  mediationPhoneNumber: undefined,
  mediationContactPerson: undefined
}

export const defenceWithDisputeData = {
  ...baseResponseData,
  ...baseDefenceData,
  defenceType: 'DISPUTE'
}

export const defenceWithAmountClaimedAlreadyPaidData = {
  ...baseResponseData,
  ...baseDefenceData,
  defenceType: 'ALREADY_PAID',
  paymentDeclaration: {
    paidDate: '2017-12-31',
    paidAmount: 100,
    explanation: 'I paid in cash'
  }
}

export const baseFullAdmissionData = {
  responseType: 'FULL_ADMISSION',
  freeMediation: 'no',
  mediationPhoneNumber: undefined,
  mediationContactPerson: undefined
}

export function basePayImmediatelyData () {
  return {
    paymentIntention: {
      paymentOption: PaymentOption.IMMEDIATELY,
      paymentDate: MomentFactory.currentDate().add(5, 'days')
    }
  }
}

export function basePayImmediatelyDatePastData () {
  return {
    paymentIntention: {
      paymentOption: PaymentOption.IMMEDIATELY,
      paymentDate: MomentFactory.currentDate().subtract(5, 'days')
    }
  }
}

export const basePayByInstalmentsData = {
  paymentIntention: {
    paymentOption: PaymentOption.INSTALMENTS,
    repaymentPlan: {
      instalmentAmount: 100,
      firstPaymentDate: '2050-12-31',
      paymentSchedule: PaymentSchedule.EACH_WEEK,
      completionDate: '2051-12-31',
      paymentLength: '1'
    }
  }
}

export const basePayBySetDateData = {
  paymentIntention: {
    paymentOption: PaymentOption.BY_SPECIFIED_DATE,
    paymentDate: '2050-12-31'
  }
}
export const basePartialAdmissionData = {
  responseType: 'PART_ADMISSION'
}

export const basePartialEvidencesAndTimeLines = {
  evidence: {
    rows: [
      {
        type: 'CONTRACTS_AND_AGREEMENTS',
        description: ' you might have signed a contract'
      }
    ],
    comment: ' you might have signed a contract'
  },
  timeline: {
    rows: [
      {
        date: '1 May 2017',
        description: ' you might have signed a contract'
      }
    ],
    comment: ' you might have signed a contract'
  }
}

export function fullAdmissionWithImmediatePaymentData () {
  return {
    ...baseResponseData,
    ...baseFullAdmissionData,
    ...basePayImmediatelyData()
  }
}

export function partialAdmissionWithImmediatePaymentData () {
  return {
    ...baseResponseData,
    ...basePartialAdmissionData,
    ...basePartialEvidencesAndTimeLines,
    defence: 'i have paid more than enough',
    ...basePayImmediatelyData(),
    amount: 3000
  }
}

export function partialAdmissionWithImmediatePaymentDataV2 () {
  return {
    ...baseResponseData,
    ...basePartialAdmissionData,
    ...basePartialEvidencesAndTimeLines,
    defence: 'i have paid more than enough',
    ...basePayImmediatelyData(),
    amount: 3000
  }
}

export const partialAdmissionFromStatesPaidDefence = {
  ...baseResponseData,
  ...basePartialAdmissionData,
  amount: 100,
  paymentDeclaration: {
    paidDate: '2017-12-31',
    explanation: 'I paid in cash'
  },
  defence: 'bla bla bla',
  timeline: {
    rows: [],
    comment: 'I do not agree'
  },
  evidence: {
    rows: []
  },
  freeMediation: 'no',
  mediationPhoneNumber: undefined,
  mediationContactPerson: undefined
}

export const partialAdmissionFromStatesPaidWithMediationDefence = {
  ...baseResponseData,
  ...basePartialAdmissionData,
  amount: 100,
  paymentDeclaration: {
    paidDate: '2017-12-31',
    explanation: 'I paid in cash'
  },
  defence: 'bla bla bla',
  timeline: {
    rows: [],
    comment: 'I do not agree'
  },
  evidence: {
    rows: []
  },
  freeMediation: 'yes'
}

export const partialAdmissionAlreadyPaidData = {
  ...baseResponseData,
  ...basePartialAdmissionData,
  ...basePartialEvidencesAndTimeLines,
  amount: 3000,
  defence: 'i have paid more than enough',
  paymentDeclaration: {
    paidDate: '2050-12-31',
    explanation: 'i have already paid enough'
  }
}

export const fullAdmissionWithPaymentBySetDateData = {
  ...baseResponseData,
  ...baseFullAdmissionData,
  ...basePayBySetDateData
}

export const fullAdmissionWithPaymentBySetDateDataInNext2days = {
  ...baseResponseData,
  ...baseFullAdmissionData,
  paymentIntention: {
    paymentOption: PaymentOption.BY_SPECIFIED_DATE,
    paymentDate: MomentFactory.currentDate().add(2, 'days').toISOString()
  }
}

export const fullAdmissionWithReasonablePaymentBySetDateData = {
  ...baseResponseData,
  ...baseFullAdmissionData,
  paymentIntention: {
    paymentOption: PaymentOption.BY_SPECIFIED_DATE,
    paymentDate: MomentFactory.currentDate().add(65, 'days').toISOString()
  }
}

export const partialAdmissionWithPaymentBySetDateData = {
  ...baseResponseData,
  ...basePartialAdmissionData,
  ...basePartialEvidencesAndTimeLines,
  defence: 'i have paid more than enough',
  ...basePayBySetDateData,
  amount: 3000
}

export const partialAdmissionWithPaymentByInstalmentsData = {
  ...baseResponseData,
  ...basePartialAdmissionData,
  ...basePartialEvidencesAndTimeLines,
  defence: 'i have paid more than enough',
  ...basePayByInstalmentsData,
  amount: 3000
}

export const fullAdmissionWithPaymentByInstalmentsData = {
  ...baseResponseData,
  ...baseFullAdmissionData,
  ...basePayByInstalmentsData
}

export const fullAdmissionWithPaymentByInstalmentsDataCompany = {
  ...baseCompanyResponseData,
  ...baseFullAdmissionData,
  ...basePayByInstalmentsData
}

export const fullAdmissionWithPaymentByInstalmentsDataWithReasonablePaymentSchedule = {
  ...baseResponseData,
  ...baseFullAdmissionData,
  paymentIntention: {
    paymentOption: PaymentOption.INSTALMENTS,
    repaymentPlan: {
      instalmentAmount: 100,
      firstPaymentDate: MomentFactory.currentDate().add(80, 'days').toISOString(),
      paymentSchedule: PaymentSchedule.EACH_WEEK,
      completionDate: MomentFactory.currentDate().add(100, 'days').toISOString(),
      paymentLength: '1'
    }
  }
}

export const fullAdmissionWithPaymentByInstalmentsDataWithUnReasonablePaymentSchedule = {
  ...baseResponseData,
  ...baseFullAdmissionData,
  paymentIntention: {
    paymentOption: PaymentOption.INSTALMENTS,
    repaymentPlan: {
      instalmentAmount: 100,
      firstPaymentDate: MomentFactory.maxDate().toISOString(),
      paymentSchedule: PaymentSchedule.EACH_WEEK,
      completionDate: MomentFactory.maxDate().toISOString(),
      paymentLength: '1'
    }
  }
}

export const statementOfMeansWithMandatoryFieldsOnlyData = {
  bankAccounts: [
    {
      balance: 1000,
      joint: false,
      type: BankAccountType.CURRENT_ACCOUNT
    }
  ],
  disability: DisabilityStatus.NO,
  priorityDebts: [],
  residence: {
    type: ResidenceType.OWN_HOME
  },
  employment: {
    unemployment: {
      retired: true
    }
  },
  incomes: [{
    amount: 200,
    frequency: PaymentFrequency.WEEK,
    type: IncomeType.CHILD_BENEFIT
  }] as Income[],
  expenses: [{
    amount: 100,
    frequency: PaymentFrequency.MONTH,
    type: ExpenseType.MORTGAGE
  }] as Expense[],
  carer: false
}

export const statementOfMeansWithMandatoryFieldsAndNoDisposableIncome = {
  bankAccounts: [
    {
      balance: 0,
      joint: false,
      type: BankAccountType.CURRENT_ACCOUNT
    }
  ],
  disability: DisabilityStatus.NO,
  priorityDebts: [],
  residence: {
    type: ResidenceType.OWN_HOME
  },
  employment: {
    unemployment: {
      retired: true
    }
  },
  incomes: [{
    amount: 10,
    frequency: PaymentFrequency.WEEK,
    type: IncomeType.CHILD_BENEFIT
  }] as Income[],
  expenses: [{
    amount: 1000,
    frequency: PaymentFrequency.MONTH,
    type: ExpenseType.MORTGAGE
  }] as Expense[],
  carer: false
}

export const statementOfMeansWithAllFieldsData = {
  ...statementOfMeansWithMandatoryFieldsOnlyData,
  dependant: {
    children: [{
      ageGroupType: AgeGroupType.UNDER_11,
      numberOfChildren: 1
    }, {
      ageGroupType: AgeGroupType.BETWEEN_11_AND_15,
      numberOfChildren: 2
    }, {
      ageGroupType: AgeGroupType.BETWEEN_16_AND_19,
      numberOfChildren: 3,
      numberOfChildrenLivingWithYou: 3
    }],
    otherDependants: {
      numberOfPeople: 5,
      details: 'Colleagues',
      anyDisabled: false
    },
    anyDisabledChildren: false
  },
  employment: {
    employers: [{
      jobTitle: 'Service manager',
      name: 'HMCTS'
    }],
    selfEmployment: {
      jobTitle: 'Director',
      annualTurnover: 100000,
      onTaxPayments: {
        amountYouOwe: 100,
        reason: 'Various taxes'
      }
    }
  },
  debts: [{
    description: 'Hard to tell',
    totalOwed: 1000,
    monthlyPayments: 100
  }],
  courtOrders: [{
    claimNumber: '000MC001',
    amountOwed: 100,
    monthlyInstalmentAmount: 10
  }],
  carer: true
}

export const fullAdmissionWithSoMPaymentBySetDate = {
  ...fullAdmissionWithPaymentBySetDateData,
  statementOfMeans: {
    ...statementOfMeansWithAllFieldsData
  }
}

export const fullAdmissionWithSoMPaymentBySetDateInNext2Days = {
  ...fullAdmissionWithPaymentBySetDateDataInNext2days,
  statementOfMeans: {
    ...statementOfMeansWithAllFieldsData
  }
}

export const fullAdmissionWithSoMReasonablePaymentBySetDateAndNoDisposableIncome = {
  ...fullAdmissionWithReasonablePaymentBySetDateData,
  statementOfMeans: {
    ...statementOfMeansWithMandatoryFieldsAndNoDisposableIncome
  }
}

export const fullAdmissionWithSoMPaymentByInstalmentsData = {
  ...fullAdmissionWithPaymentByInstalmentsData,
  statementOfMeans: {
    ...statementOfMeansWithAllFieldsData
  }
}

export const fullAdmissionWithSoMPaymentByInstalmentsDataCompany = {
  ...fullAdmissionWithPaymentByInstalmentsDataCompany,
  statementOfMeans: {
    ...statementOfMeansWithAllFieldsData
  }
}

export const fullAdmissionWithSoMPaymentByInstalmentsDataWithReasonablePaymentSchedule = {
  ...fullAdmissionWithPaymentByInstalmentsDataWithReasonablePaymentSchedule,
  statementOfMeans: {
    ...statementOfMeansWithMandatoryFieldsOnlyData
  }
}

export const fullAdmissionWithSoMPaymentByInstalmentsDataWithUnreasonablePaymentSchedule = {
  ...fullAdmissionWithPaymentByInstalmentsDataWithUnReasonablePaymentSchedule,
  statementOfMeans: {
    ...statementOfMeansWithMandatoryFieldsOnlyData
  }
}

export const fullAdmissionWithSoMPaymentByInstalmentsDataWithNoDisposableIncome = {
  ...fullAdmissionWithPaymentByInstalmentsDataWithReasonablePaymentSchedule,
  statementOfMeans: {
    ...statementOfMeansWithMandatoryFieldsAndNoDisposableIncome
  }
}

export const partialAdmissionWithSoMPaymentBySetDateData = {
  ...partialAdmissionWithPaymentBySetDateData,
  statementOfMeans: {
    ...statementOfMeansWithAllFieldsData
  }
}

export const partialAdmissionWithPaymentBySetDateCompanyData = {
  ...baseCompanyResponseData,
  ...basePartialAdmissionData,
  ...basePartialEvidencesAndTimeLines,
  defence: 'i have paid more than enough',
  ...basePayBySetDateData,
  amount: 3000
}

export function fullAdmissionWithPaymentByInstalmentsDataPaymentDateBeforeMonth () {
  return {
    ...baseResponseData,
    ...baseFullAdmissionData,
    paymentIntention: {
      paymentOption: PaymentOption.INSTALMENTS,
      repaymentPlan: {
        instalmentAmount: 100,
        firstPaymentDate: MomentFactory.currentDate().add(10, 'days'),
        paymentSchedule: PaymentSchedule.EACH_WEEK
      }
    }
  }
}

export function partialAdmissionWithPaymentByInstalmentsDataPaymentDateAfterMonth () {
  return {
    ...baseResponseData,
    ...basePartialAdmissionData,
    ...basePartialEvidencesAndTimeLines,
    defence: 'i have paid more than enough',
    paymentIntention: {
      paymentOption: PaymentOption.INSTALMENTS,
      repaymentPlan: {
        instalmentAmount: 100,
        firstPaymentDate: MomentFactory.currentDate().add(50, 'days'),
        paymentSchedule: PaymentSchedule.EACH_WEEK
      }
    },
    amount: 3000
  }
}

export function fullAdmissionWithPaymentBySetDateDataPaymentDateAfterMonth () {
  return {
    ...baseResponseData,
    ...baseFullAdmissionData,
    paymentIntention: {
      paymentOption: PaymentOption.BY_SPECIFIED_DATE,
      paymentDate: MomentFactory.currentDate().add(50, 'days')
    }
  }
}

export function partialAdmissionWithPaymentBySetDateDataPaymentDateBeforeMonth () {
  return {
    ...baseResponseData,
    ...basePartialAdmissionData,
    ...basePartialEvidencesAndTimeLines,
    defence: 'i have paid more than enough',
    paymentIntention: {
      paymentOption: PaymentOption.BY_SPECIFIED_DATE,
      paymentDate: MomentFactory.currentDate().add(10, 'days')
    },
    amount: 3000
  }
}

export const fullDefenceWithStatesPaidGreaterThanClaimAmount = {
  ...defenceWithAmountClaimedAlreadyPaidData,
  paymentDeclaration: {
    paidDate: '2017-12-31',
    paidAmount: '20000',
    explanation: 'I paid in cash'
  }
}

export const fullDefenceData = {
  ...baseDefenceData
}

export const fullDefenceWithStatesLessThanClaimAmount = {
  ...defenceWithAmountClaimedAlreadyPaidData,
  paymentDeclaration: {
    paidDate: '2017-12-31',
    paidAmount: '80',
    explanation: 'I paid in cash'
  },
  responseType: 'PART_ADMISSION'
}

export const fullDefenceWithStatesLessThanClaimAmountWithMediation = {
  ...defenceWithAmountClaimedAlreadyPaidData,
  paymentDeclaration: {
    paidDate: '2017-12-31',
    paidAmount: '80',
    explanation: 'I paid in cash'
  },
  responseType: 'PART_ADMISSION',
  freeMediation: 'yes'
}
