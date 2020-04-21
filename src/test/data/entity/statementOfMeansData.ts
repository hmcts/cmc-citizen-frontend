import { DisabilityStatus } from 'claims/models/response/statement-of-means/disabilityStatus'
import { Income, IncomeType } from 'claims/models/response/statement-of-means/income'
import { PaymentFrequency } from 'claims/models/response/core/paymentFrequency'
import { AgeGroupType } from 'claims/models/response/statement-of-means/dependant'
import { PriorityDebtType } from 'claims/models/response/statement-of-means/priorityDebts'
import { ResidenceType } from 'claims/models/response/statement-of-means/residence'
import { BankAccountType } from 'claims/models/response/statement-of-means/bankAccount'
import { ExpenseType } from 'claims/models/response/statement-of-means/expense'

export const sampleDefendantOnPension: Income = {
  type: IncomeType.PENSION,
  frequency: PaymentFrequency.MONTH,
  amount: 200
}

export const samplePartnerDetails = {
  partner: {
    over18: true,
    disability: DisabilityStatus.SEVERE,
    pensioner: false
  }
}

export const sampleUnder18PartnerDetails = {
  partner: {
    over18: false,
    disability: DisabilityStatus.NO,
    pensioner: false
  }
}

export const samplePartnerPensioner = {
  partner: {
    over18: true,
    disability: DisabilityStatus.SEVERE,
    pensioner: true
  }
}
export const sampleOneDependantDetails = {
  dependant: {
    children: [{ ageGroupType: AgeGroupType.UNDER_11, numberOfChildren: 1 }],
    numberOfMaintainedChildren : 0,
    anyDisabledChildren: false,
    otherDependants: { numberOfPeople: 0, details: 'some string', anyDisabled: false }
  }
}

export const sampleOneDisabledDependantDetails = {
  dependant: {
    children: [{ ageGroupType: AgeGroupType.UNDER_11, numberOfChildren: 1 }],
    numberOfMaintainedChildren: 0,
    anyDisabledChildren: true,
    otherDependants: { numberOfPeople: 0, details: 'some string', anyDisabled: true }
  }
}

export const sampleElevenDependantDetails = {
  dependant : {
    children: [
      { ageGroupType: AgeGroupType.UNDER_11, numberOfChildren: 3 },
      { ageGroupType: AgeGroupType.BETWEEN_11_AND_15, numberOfChildren: 3 },
      { ageGroupType: AgeGroupType.BETWEEN_16_AND_19, numberOfChildren: 2, numberOfChildrenLivingWithYou: 2 }],
    anyDisabledChildren: true,
    numberOfMaintainedChildren: 1,
    otherDependants: { numberOfPeople: 3, details: 'some string', anyDisabled: true }
  }
}

export const samplePriorityDebts = {
  priorityDebts: [
    { type: PriorityDebtType.MAINTENANCE_PAYMENTS, frequency: PaymentFrequency.MONTH, amount: 200 },
    { type: PriorityDebtType.WATER, frequency: PaymentFrequency.MONTH, amount: 155.55 },
    { type: PriorityDebtType.COUNCIL_TAX, frequency: PaymentFrequency.WEEK, amount: 10 }]
}

export const samplePriorityDebtsNoFrequency = {
  priorityDebts: [{ type: PriorityDebtType.MAINTENANCE_PAYMENTS, frequency: undefined, amount: 200 }]
}

export const samplePriorityDebtsNoAmount = {
  priorityDebts: [ { type: PriorityDebtType.MAINTENANCE_PAYMENTS, frequency: PaymentFrequency.WEEK, amount: undefined }]
}

export const sampleStatementOfMeansBase = {
  residence: {
    type: ResidenceType.OWN_HOME,
    otherDetail: ''
  },
  employment: {
    selfEmployment: {
      jobTitle: 'IT',
      annualTurnover: 3000,
      onTaxPayments: {
        amountYouOwe: 0,
        reason: ''
      }
    }
  },
  bankAccounts: [{
    type: BankAccountType.CURRENT_ACCOUNT,
    joint: false,
    balance: 1000
  }, {
    type: BankAccountType.ISA,
    joint: true,
    balance: 2000
  }, {
    type: BankAccountType.OTHER,
    joint: false,
    balance: 4000
  }],
  debts: [{
    description: 'Something',
    totalOwed: 3000,
    monthlyPayments: 30
  }, {
    description: 'Something else',
    totalOwed: 4000,
    monthlyPayments: 40
  }],
  courtOrders: [
    {
      claimNumber: '123',
      amountOwed: 2000,
      monthlyInstalmentAmount: 20
    },
    {
      claimNumber: '456',
      amountOwed: 5000,
      monthlyInstalmentAmount: 50
    }
  ],
  reason: 'Because'
}

export const sampleIncomesData = {
  incomes: [
    {
      type: IncomeType.JOB,
      frequency: PaymentFrequency.MONTH,
      amount: 1500
    },
    {
      type: IncomeType.INCOME_SUPPORT,
      frequency: PaymentFrequency.WEEK,
      amount: 50
    }
  ]
}

export const sampleIncomesWithPensionData = {
  incomes: [
    {
      type: IncomeType.JOB,
      frequency: PaymentFrequency.MONTH,
      amount: 1500
    },
    {
      type: IncomeType.INCOME_SUPPORT,
      frequency: PaymentFrequency.WEEK,
      amount: 50
    },
    sampleDefendantOnPension
  ]
}

export const sampleExpensesData = {
  expenses: [
    {
      type: ExpenseType.ELECTRICITY,
      frequency: PaymentFrequency.MONTH,
      amount: 100
    },
    {
      type: ExpenseType.GAS,
      frequency: PaymentFrequency.WEEK,
      amount: 10
    }
  ]
}

export const sampleExpensesDataWithMortgageAndRent = {
  expenses: [
    {
      type: ExpenseType.MORTGAGE,
      frequency: PaymentFrequency.MONTH,
      amount: 300
    },
    {
      type: ExpenseType.RENT,
      frequency: PaymentFrequency.MONTH,
      amount: 200
    },
    {
      type: ExpenseType.ELECTRICITY,
      frequency: PaymentFrequency.MONTH,
      amount: 100
    },
    {
      type: ExpenseType.GAS,
      frequency: PaymentFrequency.WEEK,
      amount: 10
    }
  ]
}

export const sampleStatementOfMeans = {
  ...sampleStatementOfMeansBase,
  ...sampleExpensesData,
  ...sampleIncomesData
}

export const sampleStatementOfMeansWithMortgageAndRent = {
  ...sampleStatementOfMeansBase,
  ...sampleExpensesDataWithMortgageAndRent,
  ...sampleIncomesData
}

export const sampleStatementOfMeansWithPriorityDebts = {
  ...sampleStatementOfMeans,
  ...samplePriorityDebts
}

export const sampleStatementOfMeansWithDefendantPension = {
  ...sampleStatementOfMeans,
  ...sampleExpensesData,
  ...sampleIncomesWithPensionData
}

export const sampleStatementOfMeansAllAllowances = {
  ...sampleStatementOfMeansWithDefendantPension,
  ...sampleOneDependantDetails,
  disability:  DisabilityStatus.YES
}

export const sampleStatementOfMeansWithPriorityDebtsAndAllowances = {
  ...sampleStatementOfMeansWithDefendantPension,
  ...sampleOneDependantDetails,
  disability:  DisabilityStatus.YES,
  ...samplePriorityDebts
}

export const sampleStatementOfMeansWithAllDebtsExpensesAndAllowances = {
  ...sampleStatementOfMeansWithPriorityDebtsAndAllowances,
  ...sampleExpensesDataWithMortgageAndRent
}
