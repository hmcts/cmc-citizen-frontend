import { expect } from 'chai'

import { StatementOfMeansCalculations } from 'common/statement-of-means/statementOfMeansCalculations'

import { ResidenceType } from 'claims/models/response/statement-of-means/residence'
import { Debt } from 'claims/models/response/statement-of-means/debt'
import { CourtOrder } from 'claims/models/response/statement-of-means/courtOrder'
import { Employment } from 'claims/models/response/statement-of-means/employment'
import { BankAccount, BankAccountType } from 'claims/models/response/statement-of-means/bankAccount'
import { Income, IncomeType } from 'claims/models/response/statement-of-means/income'
import { Expense, ExpenseType } from 'claims/models/response/statement-of-means/expense'
import { PaymentFrequency } from 'claims/models/response/core/paymentFrequency'

const sampleStatementOfMeans = {
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
    description: 'Somthing else',
    totalOwed: 4000,
    monthlyPayments: 40
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

describe('StatementOfMeansCalculations', () => {

  //
  // DISPOSABLE INCOMES
  //

  describe('calculateTotalMonthlyDisposableIncome', () => {
    it('should calculate the total monthly disposable income', () => {
      expect(StatementOfMeansCalculations.calculateTotalMonthlyDisposableIncome(sampleStatementOfMeans)).to.equal(2052.0833333333335)
    })
  })

  //
  // EXPENSES
  //

  describe('calculateTotalMontlyExpense', () => {
    describe('when valid debts, courtOrders and expenses are provided', () => {
      it('should calculate the total monthly expense', () => {
        expect(StatementOfMeansCalculations.calculateTotalMonthlyExpense(sampleStatementOfMeans)).to.equal(283.3333333333333)
      })
    })

    describe('when no debts, courtOrders and expenses are provided', () => {
      it('should calculate a total monthly expense of zero', () => {
        expect(StatementOfMeansCalculations.calculateTotalMonthlyExpense({ bankAccounts: [] })).to.equal(0)
      })
    })
  })

  describe('calculateMonthlyDebts', () => {
    describe('when valid monthly payments are provided', () => {
      it('should calculate the monthly debts', () => {
        const debts: Debt[] = sampleStatementOfMeans.debts
        expect(StatementOfMeansCalculations.calculateMonthlyDebts(debts)).to.equal(70)
      })
    })

    describe('when the monthly payment is unknown', () => {
      it('should ignore the debt during the calculation', () => {
        const debts: Debt[] = [
          {
            description: 'Something',
            totalOwed: 3000,
            monthlyPayments: undefined
          }
        ]
        expect(StatementOfMeansCalculations.calculateMonthlyDebts(debts)).to.equal(0)
      })
    })
  })

  describe('calculateMonthlyCourtOrders', () => {
    describe('when valid monthly instalment amounts are provided', () => {
      it('should calculate the monthly court orders', () => {
        const courtOrders: CourtOrder[] = sampleStatementOfMeans.courtOrders
        expect(StatementOfMeansCalculations.calculateMonthlyCourtOrders(courtOrders)).to.equal(70)
      })
    })

    describe('when the monthly instalment amount is unknown', () => {
      it('should ignore the court order during the calculation', () => {
        const courtOrders: CourtOrder[] = [
          {
            claimNumber: '123',
            amountOwed: 2000,
            monthlyInstalmentAmount: undefined
          }
        ]
        expect(StatementOfMeansCalculations.calculateMonthlyCourtOrders(courtOrders)).to.equal(0)
      })
    })

    describe('when the monthly instalment amount is negative', () => {
      it('should ignore the court order during the calculation', () => {
        const courtOrders: CourtOrder[] = [
          {
            claimNumber: '123',
            amountOwed: 2000,
            monthlyInstalmentAmount: -20
          }
        ]
        expect(StatementOfMeansCalculations.calculateMonthlyCourtOrders(courtOrders)).to.equal(0)
      })
    })
  })

  describe('calculateMonthlyRegularExpense', () => {
    describe('when valid amounts and frequencies are provided', () => {
      it('should calculate the total of all regular expenses', () => {
        const expenses: Expense[] = sampleStatementOfMeans.expenses
        expect(StatementOfMeansCalculations.calculateMonthlyRegularExpense(expenses)).to.equal(143.33333333333331)
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
        expect(StatementOfMeansCalculations.calculateMonthlyRegularExpense(expenses)).to.equal(0)
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
        expect(StatementOfMeansCalculations.calculateMonthlyRegularExpense(expenses)).to.equal(0)
      })
    })
  })

  //
  // INCOMES
  //

  describe('calculateTotalMontlyIncome', () => {
    describe('when valid bankAccounts, employment and incomes are provided', () => {
      it('should calculate the total monthly income', () => {
        expect(StatementOfMeansCalculations.calculateTotalMonthlyIncome(sampleStatementOfMeans)).to.equal(2335.416666666667)
      })
    })

    describe('when no employment and incomes are provided', () => {
      it('should calculate a total monthly income of zero', () => {
        expect(StatementOfMeansCalculations.calculateTotalMonthlyIncome({ bankAccounts: [] })).to.equal(0)
      })
    })
  })

  describe('calculateMonthlySelfEmployedTurnover', () => {
    describe('when self-employed', () => {
      it('should calculate the monthly turnover', () => {
        const employment: Employment = sampleStatementOfMeans.employment
        expect(StatementOfMeansCalculations.calculateMonthlySelfEmployedTurnover(employment)).to.equal(250)
      })
    })

    describe('when self-employed but with no turnover', () => {
      it('should calculate the monthly turnover', () => {
        const employment: Employment = {}
        expect(StatementOfMeansCalculations.calculateMonthlySelfEmployedTurnover(employment)).to.equal(0)
      })
    })

    describe('when not self-employed', () => {
      it('should calculate the monthly turnover', () => {
        const employment: Employment = {}
        expect(StatementOfMeansCalculations.calculateMonthlySelfEmployedTurnover(employment)).to.equal(0)
      })
    })
  })

  describe('calculateMonthlySavings', () => {
    describe('when the bank account balance is unknown', () => {
      it('should ignore the bank account during the calculation', () => {
        const bankAccounts: BankAccount[] = [
          {
            type: BankAccountType.CURRENT_ACCOUNT,
            joint: false,
            balance: undefined
          }
        ]
        expect(StatementOfMeansCalculations.calculateMonthlySavings(bankAccounts, 0)).to.equal(0)
      })
    })

    describe('when the bank account balance is negative', () => {
      it('should ignore the bank account during the calculation', () => {
        const bankAccounts: BankAccount[] = [
          {
            type: BankAccountType.CURRENT_ACCOUNT,
            joint: false,
            balance: -1000
          }
        ]
        expect(StatementOfMeansCalculations.calculateMonthlySavings(bankAccounts, 0)).to.equal(0)
      })
    })

    describe('when there are no savings in excess', () => {
      it('should calculate a total savings amount of zero', () => {
        const bankAccounts: BankAccount[] = sampleStatementOfMeans.bankAccounts
        expect(StatementOfMeansCalculations.calculateMonthlySavings(bankAccounts, 4666.666666667)).to.equal(0)
      })
    })

    describe('when there are savings in excess', () => {
      it('should calculate the total savings amount', () => {
        const bankAccounts: BankAccount[] = sampleStatementOfMeans.bankAccounts
        expect(StatementOfMeansCalculations.calculateMonthlySavings(bankAccounts, 3000)).to.equal(208.33333333333334)
      })
    })
  })

  describe('calculateMonthlyRegularIncome', () => {
    describe('when valid amounts and frequencies are provided', () => {
      it('should calculate the total of all regular incomes', () => {
        const incomes: Income[] = sampleStatementOfMeans.incomes
        expect(StatementOfMeansCalculations.calculateMonthlyRegularIncome(incomes)).to.equal(1716.66666666666666)
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
        expect(StatementOfMeansCalculations.calculateMonthlyRegularIncome(incomes)).to.equal(0)
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
        expect(StatementOfMeansCalculations.calculateMonthlyRegularIncome(incomes)).to.equal(0)
      })
    })
  })
})
