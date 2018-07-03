import { IsArray, ValidateNested } from 'class-validator'
import { IncomeExpenseSource } from 'common/calculate-monthly-income-expense/incomeExpenseSource'
import { MonthlyIncome } from 'response/form/models/statement-of-means/monthlyIncome'

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

    let incomeExpenseSources

    if (Array.isArray(value.incomeExpenseSources)) {
      incomeExpenseSources = value.incomeExpenseSources.map(
        incomeExpenseSource => IncomeExpenseSource.fromObject(incomeExpenseSource)
      )
    }

    return new IncomeExpenseSources(incomeExpenseSources)
  }

  static fromFormModel (monthlyIncome?: MonthlyIncome): IncomeExpenseSources {
    if (!monthlyIncome) {
      return undefined
    }

    const incomeExpenseSources = []

    if (monthlyIncome.salarySource) {
      incomeExpenseSources.push(IncomeExpenseSource.fromFormModel(monthlyIncome.salarySource))
    }

    if (monthlyIncome.universalCreditSource) {
      incomeExpenseSources.push(IncomeExpenseSource.fromFormModel(monthlyIncome.universalCreditSource))
    }

    if (monthlyIncome.jobseekerAllowanceIncomeSource) {
      incomeExpenseSources.push(IncomeExpenseSource.fromFormModel(monthlyIncome.jobseekerAllowanceIncomeSource))
    }

    if (monthlyIncome.jobseekerAllowanceContributionSource) {
      incomeExpenseSources.push(IncomeExpenseSource.fromFormModel(monthlyIncome.jobseekerAllowanceContributionSource))
    }

    if (monthlyIncome.incomeSupportSource) {
      incomeExpenseSources.push(IncomeExpenseSource.fromFormModel(monthlyIncome.incomeSupportSource))
    }

    if (monthlyIncome.workingTaxCreditSource) {
      incomeExpenseSources.push(IncomeExpenseSource.fromFormModel(monthlyIncome.workingTaxCreditSource))
    }

    if (monthlyIncome.councilTaxSupportSource) {
      incomeExpenseSources.push(IncomeExpenseSource.fromFormModel(monthlyIncome.councilTaxSupportSource))
    }

    if (monthlyIncome.pensionSource) {
      incomeExpenseSources.push(IncomeExpenseSource.fromFormModel(monthlyIncome.pensionSource))
    }

    return new IncomeExpenseSources(incomeExpenseSources)
  }
}
