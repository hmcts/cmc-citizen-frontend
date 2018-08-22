import { Logger } from '@hmcts/nodejs-logging'

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

const logger = Logger.getLogger('common/statement-of-means')

export class StatementOfMeansCalculations {

  //
  // DISPOSABLE INCOMES
  //

  static calculateTotalMonthlyDisposableIncome (statementOfMeans: StatementOfMeans): number {
    const totalMonthlyIncome: number = StatementOfMeansCalculations.calculateTotalMonthlyIncome(statementOfMeans)
    const totalMonthlyExpense: number = StatementOfMeansCalculations.calculateTotalMonthlyExpense(statementOfMeans)

    const totalMonthlyDisposableIncome = totalMonthlyIncome - totalMonthlyExpense
    logger.debug('Monthly disposable income calculation: ', totalMonthlyDisposableIncome)
    return totalMonthlyDisposableIncome
  }

  //
  // EXPENSES
  //

  static calculateTotalMonthlyExpense (statementOfMeans: StatementOfMeans): number {
    const monthlyDebts: number = statementOfMeans.debts ? StatementOfMeansCalculations.calculateMonthlyDebts(statementOfMeans.debts) : 0
    const monthlyCourtOrders: number = statementOfMeans.courtOrders ? StatementOfMeansCalculations.calculateMonthlyCourtOrders(statementOfMeans.courtOrders) : 0
    const monthlyRegularExpense: number = statementOfMeans.expenses ? StatementOfMeansCalculations.calculateMonthlyRegularExpense(statementOfMeans.expenses) : 0

    const totalMonthlyExpense = monthlyDebts + monthlyCourtOrders + monthlyRegularExpense
    logger.debug('Monthly expense calculation: ', totalMonthlyExpense)
    return totalMonthlyExpense
  }

  static calculateMonthlyDebts (debts: Debt[]): number {

    const reducer = (total: number, debt: Debt) => {
      const monthlyPayments: number = debt.monthlyPayments

      if (!monthlyPayments) {
        return total
      }

      return total + monthlyPayments
    }

    const monthlyDebts = debts.reduce(reducer, 0)
    logger.debug('Monthly debts calculation: ', monthlyDebts)
    return monthlyDebts
  }

  static calculateMonthlyCourtOrders (courtOrders: CourtOrder[]): number {

    const reducer = (total: number, courtOrder: CourtOrder) => {
      const monthlyInstalmentAmount: number = courtOrder.monthlyInstalmentAmount

      if (!monthlyInstalmentAmount || monthlyInstalmentAmount < 0) {
        return total
      }

      return total + monthlyInstalmentAmount
    }

    const monthlyCourtOrders = courtOrders.reduce(reducer, 0)
    logger.debug('Monthly Court orders calculation: ', monthlyCourtOrders)
    return monthlyCourtOrders
  }

  static calculateMonthlyRegularExpense (expenses: Expense[]): number {
    const monthlyRegularExpense = StatementOfMeansCalculations.calculateMonthlyRegularIncomeOrExpense(expenses)
    logger.debug('Monthly regular expense calculation: ', monthlyRegularExpense)
    return monthlyRegularExpense
  }

  //
  // INCOMES
  //

  static calculateTotalMonthlyIncome (statementOfMeans: StatementOfMeans): number {
    const monthlyRegularIncome = statementOfMeans.incomes ? StatementOfMeansCalculations.calculateMonthlyRegularIncome(statementOfMeans.incomes) : 0
    const monthlySelfEmployedTurnover = statementOfMeans.employment ? StatementOfMeansCalculations.calculateMonthlySelfEmployedTurnover(statementOfMeans.employment) : 0
    const monthlySavings = StatementOfMeansCalculations.calculateMonthlySavings(statementOfMeans.bankAccounts, monthlyRegularIncome)

    const totalMonthlyIncome = monthlySelfEmployedTurnover + monthlySavings + monthlyRegularIncome
    logger.debug('Monthly income calculation: ', totalMonthlyIncome)
    return totalMonthlyIncome
  }

  static calculateMonthlySelfEmployedTurnover (employment: Employment): number {
    if (!employment.selfEmployment || !employment.selfEmployment.annualTurnover) {
      return 0
    }

    const monthlySelfEmployedTurnover = employment.selfEmployment.annualTurnover / 12
    logger.debug('Monthly self employed turnover: ', monthlySelfEmployedTurnover)
    return monthlySelfEmployedTurnover
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

    const monthlySavings = savingsInExcess / 12
    logger.debug('Monthly savings calculation: ', monthlySavings)
    return monthlySavings
  }

  static calculateMonthlyRegularIncome (incomes: Income[]): number {
    const monthlyRegularIncome = StatementOfMeansCalculations.calculateMonthlyRegularIncomeOrExpense(incomes)
    logger.debug('Monthly regular income calculation: ', monthlyRegularIncome)
    return monthlyRegularIncome
  }

  private static calculateMonthlyRegularIncomeOrExpense (incomesOrExpenses: FrequencyBasedAmount[]): number {

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
