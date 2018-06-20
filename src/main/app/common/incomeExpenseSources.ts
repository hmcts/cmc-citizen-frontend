import { IncomeExpenseSource } from 'common/incomeExpenseSource'
import { IsArray, MinLength, ValidateNested } from 'class-validator'
import { ValidationErrors as GlobalValidationErrors } from 'forms/validation/validationErrors'

export class IncomeExpenseSources {

  @ValidateNested()
  @MinLength(1, { message: 'EMPTY_ARRAY' })
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
