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

const baseResponseData = {
  defendant: individual,
  moreTimeNeeded: 'no'
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

const baseFullAdmissionData = {
  responseType: 'FULL_ADMISSION',
  freeMediation: undefined
}

const basePartialAdmissionData = {
  responseType: 'PART_ADMISSION',
  freeMediation: undefined
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
      paymentSchedule: PaymentSchedule.EACH_WEEK
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
      paymentSchedule: PaymentSchedule.EACH_WEEK
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
  }] as Expense[]
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
    numberOfMaintainedChildren: 4
  },
  employment: {
    employers: [{
      jobTitle: 'Service manager',
      name: 'HMCTS'
    }],
    selfEmployment: {
      jobTitle: 'Director',
      annualTurnover: 10000,
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
  }]
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
      paymentSchedule: PaymentSchedule.EACH_WEEK
    }
  },
  amount: 3000
}
