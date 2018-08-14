import { expect } from 'chai'
import { calculateMonthlyRegularIncome, calculateMonthlyRegularExpense } from 'common/statement-of-means/statementOfMeansCalculations'
import { Income, IncomeType } from 'claims/models/response/statement-of-means/income'
import { Expense, ExpenseType } from 'claims/models/response/statement-of-means/expense'
import { PaymentFrequency } from 'claims/models/response/core/paymentFrequency'

const sampleStatementOfMeans = {
  "residence": {
    "type": "PRIVATE_RENTAL"
  },
  "employment": {
    "selfEmployment": {
      "jobTitle": "IT",
      "annualTurnover": 3000
    }
  },
  "bankAccounts": [{
    "type": "CURRENT_ACCOUNT",
    "joint": false,
    "balance": 100
  }, {
    "type": "ISA",
    "joint": true,
    "balance": 200
  }, {
    "type": "OTHER",
    "joint": true,
    "balance": 400
  }],
  "debts": [{
    "description": "Something",
    "totalOwed": 30,
    "monthlyPayments": 400
  }, {
    "description": "Somthing Else",
    "totalOwed": 40,
    "monthlyPayments": 500
  }],
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
  ],
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
  ],
  "reason": "Because"
}

describe.only('StatementOfMeansCalculations', () => {
  describe('calculateMonthlyRegularIncome', () => {
    describe('when valid amounts and frequencies are provided', () => {
      it('should calculate the total of all regular incomes', () => {
        const incomes: Income[] = sampleStatementOfMeans.incomes
        expect(calculateMonthlyRegularIncome(incomes)).to.equal(1716.66666666666666)
      })
    })

    describe('when the frequency is unknown', () => {
      it('should ignore the regular income during the calculation', () => {
        const incomes: Income[] = [
          {
            type: IncomeType.JOB,
            frequency: undefined,
            amount: 100
          }
        ]
        expect(calculateMonthlyRegularIncome(incomes)).to.equal(0)
      })
    })

    describe('when the amount is unknown', () => {
      it('should ignore the regular income during the calculation', () => {
        const incomes: Income[] = [
          {
            type: IncomeType.JOB,
            frequency: PaymentFrequency.MONTH,
            amount: undefined
          }
        ]
        expect(calculateMonthlyRegularIncome(incomes)).to.equal(0)
      })
    })
  })

  describe('calculateMonthlyRegularExpense', () => {
    describe('when valid amounts and frequencies are provided', () => {
      it('should calculate the total of all regular expenses', () => {
        const expenses: Expense[] = sampleStatementOfMeans.expenses
        expect(calculateMonthlyRegularExpense(expenses)).to.equal(143.33333333333331)
      })
    })

    describe('when the frequency is unknown', () => {
      it('should ignore the regular expense during the calculation', () => {
        const expenses: Expense[] = [
          {
            type: ExpenseType.ELECTRICITY,
            frequency: undefined,
            amount: 100
          }
        ]
        expect(calculateMonthlyRegularExpense(expenses)).to.equal(0)
      })
    })

    describe('when the amount is unknown', () => {
      it('should ignore the regular expense during the calculation', () => {
        const expenses: Expense[] = [
          {
            type: ExpenseType.ELECTRICITY,
            frequency: PaymentFrequency.MONTH,
            amount: undefined
          }
        ]
        expect(calculateMonthlyRegularExpense(expenses)).to.equal(0)
      })
    })
  })
})
