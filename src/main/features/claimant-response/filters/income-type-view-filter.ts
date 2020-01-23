import { MonthlyIncomeType } from 'response/form/models/statement-of-means/monthlyIncomeType'

export namespace IncomeTypeViewFilter {
  export function render (value: string): string {
    return MonthlyIncomeType.valueOf(value).displayValue
  }
}
