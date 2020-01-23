import { PriorityDebtType } from 'response/form/models/statement-of-means/priorityDebtType'

export namespace PriorityDebtTypeViewFilter {
  export function render (value: string): string {
    if (!value) {
      throw new Error('Must be a valid priority debt type')
    }
    return PriorityDebtType.valueOf(value).displayValue
  }
}
