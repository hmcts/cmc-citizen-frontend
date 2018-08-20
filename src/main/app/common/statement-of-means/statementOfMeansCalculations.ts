import { FrequencyConversions } from 'common/frequency/frequencyConversions'
import { Frequency } from 'common/frequency/frequency'

import { StatementOfMeans } from 'claims/models/response/statement-of-means/statementOfMeans'
import { Debt } from 'claims/models/response/statement-of-means/debt'
import { CourtOrder } from 'claims/models/response/statement-of-means/courtOrder'
import { Employment } from 'claims/models/response/statement-of-means/employment'
import { BankAccount } from 'claims/models/response/statement-of-means/bankAccount'
import { FrequencyBasedAmount } from 'claims/models/response/statement-of-means/frequencyBasedAmount'
import { PaymentFrequency } from 'claims/models/response/core/paymentFrequency'
import { Income } from 'claims/models/response/statement-of-means/income'
import { Expense } from 'claims/models/response/statement-of-means/expense'

export class StatementOfMeansCalculations {

  //
  // DISPOSABLE INCOMES
  //

  static calculateTotalMonthlyDisposableIncome (statementOfMeans: StatementOfMeans): number {
    const totalMonthlyIncome: number = StatementOfMeansCalculations.calculateTotalMonthlyIncome(statementOfMeans)
    const totalMonthlyExpense: number = StatementOfMeansCalculations.calculateTotalMonthlyExpense(statementOfMeans)

    return totalMonthlyIncome - totalMonthlyExpense
  }

  //
  // EXPENSES
  //

  static calculateTotalMonthlyExpense (statementOfMeans: StatementOfMeans): number {
    const monthlyDebts: number = statementOfMeans.debts ? StatementOfMeansCalculations.calculateMonthlyDebts(statementOfMeans.debts) : 0
    const monthlyCourtOrders: number = statementOfMeans.courtOrders ? StatementOfMeansCalculations.calculateMonthlyCourtOrders(statementOfMeans.courtOrders) : 0
    const monthlyRegularExpense: number = statementOfMeans.expenses? StatementOfMeansCalculations.calculateMonthlyRegularExpense(statementOfMeans.expenses): 0

    return monthlyDebts + monthlyCourtOrders + monthlyRegularExpense
  }

  static calculateMonthlyDebts (debts: Debt[]): number {

    const reducer = (total: number, debt: Debt) => {
      const monthlyPayments: number = debt.monthlyPayments

      if (!monthlyPayments) {
        return total
      }

      return total + monthlyPayments
    }

    return debts.reduce(reducer, 0)
  }

  static calculateMonthlyCourtOrders (courtOrders: CourtOrder[]): number {

    const reducer = (total: number, courtOrder: CourtOrder) => {
      const monthlyInstalmentAmount: number = courtOrder.monthlyInstalmentAmount

      if (!monthlyInstalmentAmount || monthlyInstalmentAmount < 0) {
        return total
      }

      return total + monthlyInstalmentAmount
    }

    return courtOrders.reduce(reducer, 0)
  }

  static calculateMonthlyRegularExpense (expenses: Expense[]): number {
    return StatementOfMeansCalculations.calculateMonthlyRegularIncomeOrExpense(expenses)
  }

  //
  // INCOMES
  //

  static calculateTotalMonthlyIncome (statementOfMeans: StatementOfMeans): number {
    const monthlyRegularIncome = statementOfMeans.incomes ? StatementOfMeansCalculations.calculateMonthlyRegularIncome(statementOfMeans.incomes) : 0
    const monthlySelfEmployedTurnover = statementOfMeans.employment ? StatementOfMeansCalculations.calculateMonthlySelfEmployedTurnover(statementOfMeans.employment) : 0
    const monthlySavings = StatementOfMeansCalculations.calculateMonthlySavings(statementOfMeans.bankAccounts, monthlyRegularIncome);

    return monthlySelfEmployedTurnover + monthlySavings + monthlyRegularIncome
  }

  static calculateMonthlySelfEmployedTurnover (employment: Employment): number {
    if (!employment.selfEmployment || !employment.selfEmployment.annualTurnover) {
      return 0
    }
    return employment.selfEmployment.annualTurnover / 12
  }

  static calculateMonthlySavings (bankAccounts: BankAccount[], monthlyRegularIncome: number): number {

    const reducer = (total: number, bankAccount: BankAccount) => {
      const balance: number = bankAccount.balance

      if (!balance || balance < 0) {
        return total
      }

      return total + balance
    }

    const savings: number = bankAccounts.reduce(reducer, 0)
    const savingsInExcess = savings - (monthlyRegularIncome * 1.5)

    if (savingsInExcess < 0) {
      return 0
    }

    return savingsInExcess / 12
  }

  static calculateMonthlyRegularIncome (incomes: Income[]): number {
    return StatementOfMeansCalculations.calculateMonthlyRegularIncomeOrExpense(incomes)
  }

  static calculateMonthlyRegularIncomeOrExpense (incomesOrExpenses: FrequencyBasedAmount[]): number {

    const reducer = (total: number, incomeOrExpense: FrequencyBasedAmount) => {
      const frequency: Frequency = StatementOfMeansCalculations.toFrequency(incomeOrExpense.frequency)
      const amount: number = incomeOrExpense.amount

      if (!frequency || !amount) {
        return total
      }

      return total + FrequencyConversions.convertAmountToMonthly(amount, frequency)
    }

    return incomesOrExpenses.reduce(reducer, 0)
  }

  private static toFrequency (paymentFrequency: PaymentFrequency): Frequency {
    try {
      return Frequency.of(paymentFrequency)
    } catch (error) {
      return undefined
    }
  }
}
