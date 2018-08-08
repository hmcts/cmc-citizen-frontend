import { MonthlyExpenseType } from 'response/form/models/statement-of-means/monthlyExpenseType'

export namespace ExpenseTypeViewFilter {
  export function render (value: string): string {
    return MonthlyExpenseType.valueOf(value).displayValue
  }
}
