import * as _ from 'lodash'
import { IncomeExpenseSchedule } from 'common/incomeExpenseSchedule'

export interface IncomeExpenseSource {
  amount: number,
  incomeExpenseSchedule: IncomeExpenseSchedule
}

export function calculateTotalAmount (sources: IncomeExpenseSource[]): number {
  let totalMonthlyAmount = _.reduce(sources, function (total: number, source: IncomeExpenseSource) {
    const monthlyAmount = source.amount * source.incomeExpenseSchedule.valueInMonths
    return total + monthlyAmount
  }, 0)
  return _.round(totalMonthlyAmount,2)
}
