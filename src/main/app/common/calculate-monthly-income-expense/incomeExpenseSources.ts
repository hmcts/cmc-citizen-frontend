import { IncomeExpenseSource } from 'common/calculate-monthly-income-expense/incomeExpenseSource'
import { IsArray, ValidateNested } from 'class-validator'

export class IncomeExpenseSources {

  @ValidateNested()
  @IsArray()
  incomeExpenseSources?: IncomeExpenseSource[]

  constructor (incomeExpenseSources: IncomeExpenseSource[]) {
    this.incomeExpenseSources = incomeExpenseSources
  }

  static fromObject (value?: any): IncomeExpenseSources {
    if (!value) {
      return value
    }

    let incomeExpenseSources = undefined

    if (Array.isArray(value.incomeExpenseSources)) {
      incomeExpenseSources = value.incomeExpenseSources.map(
        incomeExpenseSource => IncomeExpenseSource.fromObject(incomeExpenseSource)
      )
    }

    return new IncomeExpenseSources(incomeExpenseSources)
  }
}
