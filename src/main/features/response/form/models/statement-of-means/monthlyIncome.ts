import { MonthlyIncomeSource } from './monthlyIncomeSource'
import { IsBoolean, ValidateIf, ValidateNested, ArrayMinSize } from 'class-validator'
import { ValidationErrors as GlobalValidationErrors } from 'forms/validation/validationErrors'

export const MAX_NUMBER_OF_ROWS: number = 10
export const INIT_ROW_COUNT: number = 0

export class SourceNames {
  static readonly SALARY = 'Income from your job'
}

export class ValidationErrors {
  static readonly BOOLEAN_SALARY_REQUIRED = (name: string) => `${GlobalValidationErrors.YES_NO_REQUIRED} for $name`
}

export class MonthlyIncome {

  @IsBoolean({ message: ValidationErrors.BOOLEAN_SALARY_REQUIRED(SourceNames.SALARY) })
  hasSalarySource?: boolean

  // @ArrayMinSize(1)
  @ValidateIf(o => o.hasSalarySource)
  @ValidateNested()
  salarySource?: MonthlyIncomeSource

  constructor(hasSalarySource?: boolean, salarySource?: MonthlyIncomeSource) {
    this.hasSalarySource = hasSalarySource
    this.salarySource = salarySource
  }

  static fromObject(value?: any): MonthlyIncome {
    if (!value) {
      return value
    }

    return new MonthlyIncome(
      value.hasSalarySource,
      value.hasSalarySource ? MonthlyIncomeSource.fromObject(SourceNames.SALARY, value.salarySource) : undefined
    )
  }

  deserialize (input?: any): MonthlyIncome {
    if (input) {
      this.hasSalarySource = input.hasSalarySource
      this.salarySource = input.salarySource
    }

    return this
  }
}
