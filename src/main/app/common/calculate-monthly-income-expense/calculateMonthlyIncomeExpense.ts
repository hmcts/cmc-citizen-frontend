import * as _ from 'lodash'
import { IncomeExpenseSource } from 'common/calculate-monthly-income-expense/incomeExpenseSource'

export class CalculateMonthlyIncomeExpense {

  static calculateTotalAmount (sources: IncomeExpenseSource[]): number {
    const totalMonthlyAmount = _.reduce(sources, function (total: number, source: IncomeExpenseSource) {
      const monthlyAmount = source.amount * source.schedule.valueInMonths
      return total + monthlyAmount
    }, 0)
    return _.round(totalMonthlyAmount, 2)
  }
}
