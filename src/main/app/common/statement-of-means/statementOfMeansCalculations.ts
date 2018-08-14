import * as frequencyConversions from 'common/statement-of-means/frequencyConversions'
import { Frequency } from 'common/statement-of-means/models/frequency'

import { StatementOfMeans } from 'claims/models/response/statement-of-means/statementOfMeans'
import { Debt } from 'claims/models/response/statement-of-means/debt'
import { CourtOrder } from 'claims/models/response/statement-of-means/courtOrder'
import { Employment } from 'claims/models/response/statement-of-means/employment'
import { BankAccount } from 'claims/models/response/statement-of-means/bankAccount'
import { FrequencyBasedAmount } from 'claims/models/response/statement-of-means/frequencyBasedAmount';
import { PaymentFrequency } from 'claims/models/response/core/paymentFrequency'
import { Income } from 'claims/models/response/statement-of-means/income'
import { Expense } from 'claims/models/response/statement-of-means/expense'

//
// DISPOSABLE INCOMES
//

export function calculateTotalMonthlyDisposableIncome(statementOfMeans: StatementOfMeans): number {
  return calculateTotalMontlyIncome(statementOfMeans) - calculateTotalMontlyExpense(statementOfMeans) 
}

//
// EXPENSES
//

export function calculateTotalMontlyExpense(statementOfMeans: StatementOfMeans): number {
  return calculateMonthlyDebts(statementOfMeans.debts) +
    calculateMonthlyCourtOrders(statementOfMeans.courtOrders) +
    calculateMonthlyRegularExpense(statementOfMeans.expenses)
}

export function calculateMonthlyDebts(debts: Debt[]): number {

  const reducer = (total: number, debt: Debt) => {
    const monthlyPayments: number = debt.monthlyPayments

    if (!monthlyPayments) {
      return total
    }

    return total + monthlyPayments
  }

  return debts.reduce(reducer, 0)
}

export function calculateMonthlyCourtOrders(courtOrders: CourtOrder[]): number {

  const reducer = (total: number, courtOrder: CourtOrder) => {
    const monthlyInstalmentAmount: number = courtOrder.monthlyInstalmentAmount

    if (!monthlyInstalmentAmount || monthlyInstalmentAmount < 0) {
      return total
    }

    return total + monthlyInstalmentAmount
  }

  return courtOrders.reduce(reducer, 0)
}

export function calculateMonthlyRegularExpense(expenses: Expense[]): number {
  return calculateMonthlyRegularIncomeOrExpense(expenses)
}

//
// INCOMES
//

export function calculateTotalMontlyIncome(statementOfMeans: StatementOfMeans): number {
  const monthlyRegularIncome = calculateMonthlyRegularIncome(statementOfMeans.incomes)
  return calculateMonthlySelfEmployedTurnover(statementOfMeans.employment) +
    calculateMonthlySavings(statementOfMeans.bankAccounts, monthlyRegularIncome) +
    monthlyRegularIncome;
}

export function calculateMonthlySelfEmployedTurnover(employment: Employment): number {
  if (!employment.selfEmployment || !employment.selfEmployment.annualTurnover) {
    return 0
  }
  return employment.selfEmployment.annualTurnover / 12
}

export function calculateMonthlySavings(bankAccounts: BankAccount[], monthlyRegularIncome: number): number {

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

export function calculateMonthlyRegularIncome(incomes: Income[]): number {
  return calculateMonthlyRegularIncomeOrExpense(incomes)
}

function calculateMonthlyRegularIncomeOrExpense(incomesOrExpenses: FrequencyBasedAmount[]): number {

  const reducer = (total: number, incomeOrExpense: FrequencyBasedAmount) => {
    const frequency: Frequency = toFrequency(incomeOrExpense.frequency)
    const amount: number = incomeOrExpense.amount

    if (!frequency || !amount) {
      return total
    }

    return total + frequencyConversions.convertAmountToMonthly(amount, frequency)
  }

  return incomesOrExpenses.reduce(reducer, 0)
}

function toFrequency(paymentFrequency: PaymentFrequency): Frequency {
  try {
    return Frequency.of(paymentFrequency)
  } catch (error) {
    return undefined
  }
}
