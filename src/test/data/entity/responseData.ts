import { PaymentOption } from 'claims/models/paymentOption'
import { PaymentSchedule } from 'claims/models/response/core/paymentSchedule'

import { AgeGroupType } from 'claims/models/response/statement-of-means/dependant'
import { ResidenceType } from 'claims/models/response/statement-of-means/residence'
import { BankAccountType } from 'claims/models/response/statement-of-means/bankAccount'

import { MomentFactory } from 'shared/momentFactory'
import { individual, company } from 'test/data/entity/party'
import { Income, IncomeType } from 'claims/models/response/statement-of-means/income'
import { Expense, ExpenseType } from 'claims/models/response/statement-of-means/expense'
import { PaymentFrequency } from 'claims/models/response/core/paymentFrequency'
import { DisabilityStatus } from 'claims/models/response/statement-of-means/disabilityStatus'

export const baseResponseData = {
  defendant: individual,
  moreTimeNeeded: 'no',
  freeMediation: 'no'
}

const baseCompanyResponseData = {
  defendant: company,
  moreTimeNeeded: 'no'
}

const baseDefenceData = {
  responseType: 'FULL_DEFENCE',
  defence: 'My defence',
  freeMediation: 'no'
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
    explanation: 'I paid in cash'
  }
}

export const baseFullAdmissionData = {
  responseType: 'FULL_ADMISSION',
  freeMediation: 'no'
}

const basePartialAdmissionData = {
  responseType: 'PART_ADMISSION',
  freeMediation: 'no'
}

const basePartialEvidencesAndTimeLines = {
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

export const fullAdmissionWithImmediatePaymentData = {
  ...baseResponseData,
  ...baseFullAdmissionData,
  paymentIntention: {
    paymentOption: PaymentOption.IMMEDIATELY,
    paymentDate: MomentFactory.currentDate().add(5, 'days')
  }
}

export const partialAdmissionWithImmediatePaymentData = {
  ...baseResponseData,
  ...basePartialAdmissionData,
  ...basePartialEvidencesAndTimeLines,
  defence: 'i have paid more than enough',
  paymentIntention: {
    paymentOption: PaymentOption.IMMEDIATELY,
    paymentDate: MomentFactory.currentDate().add(5, 'days')
  },
  amount: 3000
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
  freeMediation: 'no'
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
  paymentIntention: {
    paymentOption: PaymentOption.BY_SPECIFIED_DATE,
    paymentDate: '2050-12-31'
  }
}

export const partialAdmissionWithPaymentBySetDateData = {
  ...baseResponseData,
  ...basePartialAdmissionData,
  ...basePartialEvidencesAndTimeLines,
  defence: 'i have paid more than enough',
  paymentIntention: {
    paymentOption: PaymentOption.BY_SPECIFIED_DATE,
    paymentDate: '2050-12-31'
  },
  amount: 3000
}

export const fullAdmissionWithPaymentByInstalmentsData = {
  ...baseResponseData,
  ...baseFullAdmissionData,
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

export const fullAdmissionWithPaymentByInstalmentsDataWithResonablePaymentSchedule = {
  ...baseResponseData,
  ...baseFullAdmissionData,
  paymentIntention: {
    paymentOption: PaymentOption.INSTALMENTS,
    repaymentPlan: {
      instalmentAmount: 100,
      firstPaymentDate: '2018-10-01',
      paymentSchedule: PaymentSchedule.EACH_WEEK,
      completionDate: '2019-02-01',
      paymentLength: '1'
    }
  }
}

export const partialAdmissionWithPaymentByInstalmentsData = {
  ...baseResponseData,
  ...basePartialAdmissionData,
  ...basePartialEvidencesAndTimeLines,
  defence: 'i have paid more than enough',
  paymentIntention: {
    paymentOption: PaymentOption.INSTALMENTS,
    repaymentPlan: {
      instalmentAmount: 100,
      firstPaymentDate: '2050-12-31',
      paymentSchedule: PaymentSchedule.EACH_WEEK,
      completionDate: '2051-12-31',
      paymentLength: '1'
    }
  },
  amount: 3000
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
    amount: 0,
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

export const fullAdmissionWithSoMPaymentByInstalmentsData = {
  ...fullAdmissionWithPaymentByInstalmentsData,
  statementOfMeans: {
    ...statementOfMeansWithAllFieldsData
  }
}

export const fullAdmissionWithSoMPaymentByInstalmentsDataWithResonablePaymentSchedule = {
  ...fullAdmissionWithPaymentByInstalmentsDataWithResonablePaymentSchedule,
  statementOfMeans: {
    ...statementOfMeansWithMandatoryFieldsOnlyData
  }
}

export const fullAdmissionWithSoMPaymentByInstalmentsDataWithNoDisposableIncome = {
  ...fullAdmissionWithPaymentByInstalmentsDataWithResonablePaymentSchedule,
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

export const partialAdmissionWithImmediatePaymentCompanyData = {
  ...baseCompanyResponseData,
  ...basePartialAdmissionData,
  ...basePartialEvidencesAndTimeLines,
  defence: 'i have paid more than enough',
  paymentIntention: {
    paymentOption: PaymentOption.IMMEDIATELY,
    paymentDate: MomentFactory.currentDate().add(5, 'days')
  },
  amount: 3000
}

export const partialAdmissionWithPaymentBySetDateCompanyData = {
  ...baseCompanyResponseData,
  ...basePartialAdmissionData,
  ...basePartialEvidencesAndTimeLines,
  defence: 'i have paid more than enough',
  paymentIntention: {
    paymentOption: PaymentOption.BY_SPECIFIED_DATE,
    paymentDate: '2050-12-31'
  },
  amount: 3000
}

export const partialAdmissionWithPaymentByInstalmentsCompanyData = {
  ...baseCompanyResponseData,
  ...basePartialAdmissionData,
  ...basePartialEvidencesAndTimeLines,
  defence: 'i have paid more than enough',
  paymentIntention: {
    paymentOption: PaymentOption.INSTALMENTS,
    repaymentPlan: {
      instalmentAmount: 100,
      firstPaymentDate: '2050-12-31',
      paymentSchedule: PaymentSchedule.EACH_WEEK,
      completionDate: '2051-12-31',
      paymentLength: '1'
    }
  },
  amount: 3000
}

export const fullAdmissionWithPaymentByInstalmentsDataPaymentDateBeforeMonth = {
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

export const fullAdmissionWithPaymentByInstalmentsDataPaymentDateAfterMonth = {
  ...baseResponseData,
  ...baseFullAdmissionData,
  paymentIntention: {
    paymentOption: PaymentOption.INSTALMENTS,
    repaymentPlan: {
      instalmentAmount: 100,
      firstPaymentDate: MomentFactory.currentDate().add(50, 'days'),
      paymentSchedule: PaymentSchedule.EACH_WEEK
    }
  }
}

export const partialAdmissionWithPaymentByInstalmentsDataPaymentDateBeforeMonth = {
  ...baseResponseData,
  ...basePartialAdmissionData,
  ...basePartialEvidencesAndTimeLines,
  defence: 'i have paid more than enough',
  paymentIntention: {
    paymentOption: PaymentOption.INSTALMENTS,
    repaymentPlan: {
      instalmentAmount: 100,
      firstPaymentDate: MomentFactory.currentDate().add(10, 'days'),
      paymentSchedule: PaymentSchedule.EACH_WEEK
    }
  },
  amount: 3000
}

export const partialAdmissionWithPaymentByInstalmentsDataPaymentDateAfterMonth = {
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

export const fullAdmissionWithPaymentBySetDateDataPaymentDateBeforeMonth = {
  ...baseResponseData,
  ...baseFullAdmissionData,
  paymentIntention: {
    paymentOption: PaymentOption.BY_SPECIFIED_DATE,
    paymentDate: MomentFactory.currentDate().add(10, 'days')
  }
}

export const fullAdmissionWithPaymentBySetDateDataPaymentDateAfterMonth = {
  ...baseResponseData,
  ...baseFullAdmissionData,
  paymentIntention: {
    paymentOption: PaymentOption.BY_SPECIFIED_DATE,
    paymentDate: MomentFactory.currentDate().add(50, 'days')
  }
}
export const partialAdmissionWithPaymentBySetDateDataPaymentDateBeforeMonth = {
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

export const partialAdmissionWithPaymentBySetDateDataPaymentDateAfterMonth = {
  ...baseResponseData,
  ...basePartialAdmissionData,
  ...basePartialEvidencesAndTimeLines,
  defence: 'i have paid more than enough',
  paymentIntention: {
    paymentOption: PaymentOption.BY_SPECIFIED_DATE,
    paymentDate: MomentFactory.currentDate().add(50, 'days')
  },
  amount: 3000
}
