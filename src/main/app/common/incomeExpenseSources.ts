import { IncomeExpenseSource } from 'common/incomeExpenseSource'
import { ArrayMinSize, IsArray, ValidateNested } from 'class-validator'

export class IncomeExpenseSources {

  @ValidateNested()
  @ArrayMinSize(1, { message: 'INVALID_ARRAY_MIN_SIZE' })
  @IsArray({ message: 'ARRAY_REQUIRED' })
  incomeExpenseSources?: IncomeExpenseSource[]

  constructor (incomeExpenseSources: IncomeExpenseSource[]) {
    this.incomeExpenseSources = incomeExpenseSources
  }

  static fromObject (value?: any): IncomeExpenseSources {
    if (!value) {
      return value
    }

    const incomeExpenseSources = value.incomeExpenseSources || []

    return new IncomeExpenseSources(
      incomeExpenseSources.map(incomeExpenseSource => IncomeExpenseSource.fromObject(incomeExpenseSource))
    )
  }
}
