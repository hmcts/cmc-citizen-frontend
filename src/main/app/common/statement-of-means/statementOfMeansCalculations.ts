import * as frequencyConversions from 'common/statement-of-means/frequencyConversions'
import { Frequency } from 'common/statement-of-means/models/frequency'

import { FrequencyBasedAmount } from 'claims/models/response/statement-of-means/frequencyBasedAmount';
import { PaymentFrequency } from 'claims/models/response/core/paymentFrequency'
import { Income } from 'claims/models/response/statement-of-means/income'
import { Expense } from 'claims/models/response/statement-of-means/expense'

export function calculateMonthlyRegularIncome(incomes: Income[]): number {
  return calculateMonthlyRegularIncomeOrExpense(incomes)
}

export function calculateMonthlyRegularExpense(expenses: Expense[]): number {
  return calculateMonthlyRegularIncomeOrExpense(expenses)
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
