import { expect } from 'chai'

import { StatementOfMeansCalculations } from 'common/statement-of-means/statementOfMeansCalculations'
import { Debt } from 'claims/models/response/statement-of-means/debt'
import { CourtOrder } from 'claims/models/response/statement-of-means/courtOrder'
import { Employment } from 'claims/models/response/statement-of-means/employment'
import { BankAccount, BankAccountType } from 'claims/models/response/statement-of-means/bankAccount'
import { Income, IncomeType } from 'claims/models/response/statement-of-means/income'
import { Expense, ExpenseType } from 'claims/models/response/statement-of-means/expense'
import { PaymentFrequency } from 'claims/models/response/core/paymentFrequency'
import { PartyType } from 'common/partyType'
import {
  sampleDefendantDateOfBirth,
  sampleStatementOfMeans,
  sampleStatementOfMeansWithMortgageAndRent,
  sampleAllowanceData, samplePriorityDebts, samplePriorityDebtsNoFrequency, samplePriorityDebtsNoAmount
} from 'test/data/entity/statementOfMeansData'


// Tests - Living Allowance
// single under 25 / over 25
// couple over 18
// couple under 25 and over 25

// Tests - Disability
// no disabilities
// def serve partner no, disabled dependant
// def yes partner server, carer yes
// has disabled dependant
// is carer only

// Tests - Pensioner
// no pensioners
// defendant pensioners
// partner pensioner only

// Tests - Dependants
// 1 dependant
// 11 dependants

describe('StatementOfMeansCalculations', () => {

  //
  // DISPOSABLE INCOMES
  //
  let statementOfMeansCalculations: StatementOfMeansCalculations

  describe('calculateTotalMonthlyDisposableIncome', () => {
    describe('when no allowance lookup is provided', () => {
      beforeEach(() => {
        statementOfMeansCalculations = new StatementOfMeansCalculations(PartyType.INDIVIDUAL, sampleDefendantDateOfBirth, undefined)
      })
      describe('when defendant has no mortgage or rent', () => {
        it('should calculate the total monthly disposable', () => {
          expect(statementOfMeansCalculations.calculateTotalMonthlyDisposableIncome(sampleStatementOfMeans))
            .to.equal(2195.416666666667)
        })
      })
      describe('calculateTotalMonthlyDisposableIncome', () => {
        it('when defendant has mortgage and rent', () => {
          expect(statementOfMeansCalculations.calculateTotalMonthlyDisposableIncome(sampleStatementOfMeansWithMortgageAndRent))
            .to.equal(1695.416666666667)
        })
      })
      describe('calculateTotalMonthlyDisposableIncome', () => {
        it('when defendant has allowances', () => {
          expect(statementOfMeansCalculations.calculateTotalMonthlyDisposableIncome(sampleStatementOfMeans))
            .to.equal(2195.416666666667)
        })
      })
    })
  })

  //
  // EXPENSES
  //
  beforeEach(() => {
    statementOfMeansCalculations = new StatementOfMeansCalculations(PartyType.INDIVIDUAL, sampleDefendantDateOfBirth, sampleAllowanceData)
  })
  describe('calculateTotalMonthlyExpense', () => {
    describe('when valid debts, courtOrders and expenses are provided', () => {
      it('should calculate the total monthly expense (mortgage and rent only)', () => {
        expect(statementOfMeansCalculations.calculateTotalMonthlyExpense(sampleStatementOfMeansWithMortgageAndRent)).to.equal(640)
      })
    })

    describe('when no debts, courtOrders and expenses are provided', () => {
      it('should calculate a total monthly expense of zero', () => {
        expect(statementOfMeansCalculations.calculateTotalMonthlyExpense({ bankAccounts: [] })).to.equal(0)
      })
    })
  })

  describe('calculateMonthlyDebts', () => {
    describe('when valid monthly payments are provided', () => {
      it('should calculate the monthly debts', () => {
        const debts: Debt[] = sampleStatementOfMeans.debts
        expect(statementOfMeansCalculations.calculateMonthlyDebts(debts)).to.equal(70)
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
        expect(statementOfMeansCalculations.calculateMonthlyDebts(debts)).to.equal(0)
      })
    })
  })

  describe('calculateMonthlyCourtOrders', () => {
    describe('when valid monthly instalment amounts are provided', () => {
      it('should calculate the monthly court orders', () => {
        const courtOrders: CourtOrder[] = sampleStatementOfMeans.courtOrders
        expect(statementOfMeansCalculations.calculateMonthlyCourtOrders(courtOrders)).to.equal(70)
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
        expect(statementOfMeansCalculations.calculateMonthlyCourtOrders(courtOrders)).to.equal(0)
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
        expect(statementOfMeansCalculations.calculateMonthlyCourtOrders(courtOrders)).to.equal(0)
      })
    })
  })

  describe('calculateMonthlyRegularExpense', () => {
    describe('when valid amounts and frequencies are provided', () => {
      it('should calculate the total mortgage and rent', () => {
        const expenses: Expense[] = sampleStatementOfMeansWithMortgageAndRent.expenses
        expect(statementOfMeansCalculations.calculateMonthlyRegularExpense(expenses)).to.equal(500)
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
        expect(statementOfMeansCalculations.calculateMonthlyRegularExpense(expenses)).to.equal(0)
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
        expect(statementOfMeansCalculations.calculateMonthlyRegularExpense(expenses)).to.equal(0)
      })
    })
  })

  describe('calculatePriorityDebts', () => {
    describe('when valid amounts and frequencies are provided', () => {
      it('should calculate the total of all priority debts', () => {
        expect(statementOfMeansCalculations.calculateMonthlyPriorityDebts(samplePriorityDebts)).to.equal(398.8833333333333)
      })
    })
    describe('when the frequency is unknown', () => {
      it('should ignore the priority debts during the calculation', () => {
        expect(statementOfMeansCalculations.calculateMonthlyPriorityDebts(samplePriorityDebtsNoFrequency)).to.equal(0)
      })
    })
    describe('when the amount is unknown', () => {
      it('should ignore the priority debts during the calculation', () => {
        expect(statementOfMeansCalculations.calculateMonthlyPriorityDebts(samplePriorityDebtsNoAmount)).to.equal(0)
      })
    })
  })

  //
  // INCOMES
  //

  describe('calculateTotalMonthlyIncome', () => {
    describe('when valid bankAccounts, employment and incomes are provided', () => {
      it('should calculate the total monthly income', () => {
        expect(statementOfMeansCalculations.calculateTotalMonthlyIncome(sampleStatementOfMeans)).to.equal(2335.416666666667)
      })
    })

    describe('when no employment and incomes are provided', () => {
      it('should calculate a total monthly income of zero', () => {
        expect(statementOfMeansCalculations.calculateTotalMonthlyIncome({ bankAccounts: [] })).to.equal(0)
      })
    })
  })

  describe('calculateMonthlySelfEmployedTurnover', () => {
    describe('when self-employed', () => {
      it('should calculate the monthly turnover', () => {
        const employment: Employment = sampleStatementOfMeans.employment
        expect(statementOfMeansCalculations.calculateMonthlySelfEmployedTurnover(employment)).to.equal(250)
      })
    })

    describe('when self-employed but with no turnover', () => {
      it('should calculate the monthly turnover', () => {
        const employment: Employment = {}
        expect(statementOfMeansCalculations.calculateMonthlySelfEmployedTurnover(employment)).to.equal(0)
      })
    })

    describe('when not self-employed', () => {
      it('should calculate the monthly turnover', () => {
        const employment: Employment = {}
        expect(statementOfMeansCalculations.calculateMonthlySelfEmployedTurnover(employment)).to.equal(0)
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
        expect(statementOfMeansCalculations.calculateMonthlySavings(bankAccounts, 0)).to.equal(0)
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
        expect(statementOfMeansCalculations.calculateMonthlySavings(bankAccounts, 0)).to.equal(0)
      })
    })

    describe('when there are no savings in excess', () => {
      it('should calculate a total savings amount of zero', () => {
        const bankAccounts: BankAccount[] = sampleStatementOfMeans.bankAccounts
        expect(statementOfMeansCalculations.calculateMonthlySavings(bankAccounts, 4666.666666667)).to.equal(0)
      })
    })

    describe('when there are savings in excess', () => {
      it('should calculate the total savings amount', () => {
        const bankAccounts: BankAccount[] = sampleStatementOfMeans.bankAccounts
        expect(statementOfMeansCalculations.calculateMonthlySavings(bankAccounts, 3000)).to.equal(208.33333333333334)
      })
    })
  })

  describe('calculateMonthlyRegularIncome', () => {
    describe('when valid amounts and frequencies are provided', () => {
      it('should calculate the total of all regular incomes', () => {
        const incomes: Income[] = sampleStatementOfMeans.incomes
        expect(statementOfMeansCalculations.calculateMonthlyRegularIncome(incomes)).to.equal(1716.66666666666666)
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
        expect(statementOfMeansCalculations.calculateMonthlyRegularIncome(incomes)).to.equal(0)
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
        expect(statementOfMeansCalculations.calculateMonthlyRegularIncome(incomes)).to.equal(0)
      })
    })
  })

  //
  // ALLOWANCES
  //

  describe('calculateTotalMonthlyAllowance', () => {

  })

  describe('calculateMonthlyLivingAllowance', () => {

  })

  describe('calculateMonthlyDependantsAllowance', () => {

  })

  describe('calculateMonthlyPensionerAllowance', () => {

  })

  describe('calculateMonthlyDisabilityAllowance', () => {

  })
})
