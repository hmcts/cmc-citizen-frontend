import { IncomeExpenseSchedule } from 'common/calculate-monthly-income-expense/incomeExpenseSchedule'
import { FrequencyBasedAmount } from 'claims/models/response/statement-of-means/frequencyBasedAmount'

export namespace MonthlyAmountViewFilter {
  export function render (income: FrequencyBasedAmount): number {
    if (!income || !income.frequency || (income.amount < 0) || (income.amount === undefined)) {
      throw new Error('Must be a valid FrequencyBasedAmount')
    }
    switch (income.frequency) {
      case IncomeExpenseSchedule.WEEK.value:
        return income.amount * IncomeExpenseSchedule.WEEK.valueInMonths
      case IncomeExpenseSchedule.TWO_WEEKS.value:
        return income.amount * IncomeExpenseSchedule.TWO_WEEKS.valueInMonths
      case IncomeExpenseSchedule.FOUR_WEEKS.value:
        return income.amount * IncomeExpenseSchedule.FOUR_WEEKS.valueInMonths
      case IncomeExpenseSchedule.MONTH.value:
        return income.amount
    }
  }

}
