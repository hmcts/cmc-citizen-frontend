import { PriorityDebtType } from 'response/form/models/statement-of-means/priorityDebtType'

export namespace PriorityDebtTypeViewFilter {
  export function render (value: string): string {
    return PriorityDebtType.valueOf(value).displayValue
  }
}
