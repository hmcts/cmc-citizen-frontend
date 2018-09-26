import { Allowance } from 'claims/models/response/statement-of-means/allowance'
import * as config from 'config'
import { DisabilityStatus } from 'claims/models/response/statement-of-means/disabilityStatus'
import { Income, IncomeType } from 'claims/models/response/statement-of-means/income'
import { PaymentFrequency } from 'claims/models/response/core/paymentFrequency'
import { Partner } from 'claims/models/response/statement-of-means/partner'
import { AgeGroupType, Dependant } from 'claims/models/response/statement-of-means/dependant'
import { PriorityDebts, PriorityDebtType } from 'claims/models/response/statement-of-means/priorityDebts'
import * as moment from 'moment'
import { MomentFactory } from 'shared/momentFactory'
import { ResidenceType } from 'claims/models/response/statement-of-means/residence'
import { BankAccountType } from 'claims/models/response/statement-of-means/bankAccount'
import { ExpenseType } from 'claims/models/response/statement-of-means/expense'

export const sampleAllowanceData: Allowance = new Allowance().deserialize(JSON.parse(config.get<string>('meansAllowances')))

export const sampleDefendantOnPension: Income = {
  type: IncomeType.PENSION,
  frequency: PaymentFrequency.MONTH,
  amount: 200
}

export const samplePartnerDetails: Partner = {
  over18: true,
  disability: DisabilityStatus.SEVERE,
  pensioner: false
}

export const sampleOneDependantDetails: Dependant = {
  children: [{ ageGroupType: AgeGroupType.UNDER_11, numberOfChildren: 1 }],
  numberOfMaintainedChildren : 0,
  anyDisabledChildren: true,
  otherDependants: { numberOfPeople: 0, details: 'some string', anyDisabled: true }
}

export const sampleElevenDependantDetails: Dependant = {
  children: [
    { ageGroupType: AgeGroupType.UNDER_11, numberOfChildren: 3 },
    { ageGroupType: AgeGroupType.BETWEEN_11_AND_15, numberOfChildren: 3 },
    { ageGroupType: AgeGroupType.BETWEEN_16_AND_19, numberOfChildren: 2, numberOfChildrenLivingWithYou: 2 }],
  anyDisabledChildren: true,
  numberOfMaintainedChildren: 1,
  otherDependants: { numberOfPeople: 3, details: 'some string', anyDisabled: true }
}

export const samplePriorityDebts: PriorityDebts[] = [
  { type: PriorityDebtType.MAINTENANCE_PAYMENTS, frequency: PaymentFrequency.MONTH, amount: 200 },
  { type: PriorityDebtType.WATER, frequency: PaymentFrequency.MONTH, amount: 155.55 }]

export const sampleDefendantDateOfBirth: moment.Moment = MomentFactory.parse('1999-01-01')

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
  ...sampleStatementOfMeansBase,
  ...sampleExpensesData,
  ...sampleIncomesData,
  ...samplePriorityDebts
}

export const sampleStatementOfMeansWithDefendantPension = {
  ...sampleStatementOfMeans,
  ...sampleExpensesData,
  ...sampleIncomesWithPensionData
}

export const sampleStatementOfMeansWithPartnerPension = {
  ...sampleStatementOfMeans,
  ...sampleExpensesData,
  ...sampleIncomesWithPensionData,
  ...samplePartnerDetails
}

export const sampleStatementOfMeansWithOneDependant = {
  ...sampleStatementOfMeansBase,
  ...sampleExpensesData,
  ...sampleOneDependantDetails
}

export const sampleStatementOfMeansWithElevenDependants = {
  ...sampleStatementOfMeansBase,
  ...sampleExpensesData,
  ...sampleElevenDependantDetails
}

export const sampleStatementOfMeansWithDefendantDisability = {
  ...sampleStatementOfMeansBase,
  ...sampleExpensesData,
  DisabilityStatus:  DisabilityStatus.YES
}

export const sampleStatementOfMeansWithPartnerDisability = {
  ...sampleStatementOfMeansBase,
  ...sampleExpensesData,
  DisabilityStatus:  DisabilityStatus.YES,
  ...samplePartnerDetails
}
