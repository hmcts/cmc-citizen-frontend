import { IncomeExpenseSource } from 'common/calculate-monthly-income-expense/incomeExpenseSource'
import { IsArray, ValidateNested } from 'class-validator'
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

  static fromFormModel(monthlyIncome: MonthlyIncome): IncomeExpenseSources {
    if (!monthlyIncome) {
      return undefined
    }

    const incomeExpenseSources = []

    if(monthlyIncome.hasSalarySource) {
      incomeExpenseSources.push(IncomeExpenseSource.fromFormModel(monthlyIncome.salarySource))
    }

    if(monthlyIncome.hasUniversalCreditSource) {
      incomeExpenseSources.push(IncomeExpenseSource.fromFormModel(monthlyIncome.universalCreditSource))
    }

    if(monthlyIncome.hasJobseekerAllowanceIncomeSource) {
      incomeExpenseSources.push(IncomeExpenseSource.fromFormModel(monthlyIncome.jobseekerAllowanceIncomeSource))
    }

    if(monthlyIncome.hasJobseekerAllowanceContributionSource) {
      incomeExpenseSources.push(IncomeExpenseSource.fromFormModel(monthlyIncome.jobseekerAllowanceContributionSource))
    }

    if(monthlyIncome.hasIncomeSupportSource) {
      incomeExpenseSources.push(IncomeExpenseSource.fromFormModel(monthlyIncome.incomeSupportSource))
    }

    if(monthlyIncome.hasWorkingTaxCreditSource) {
      incomeExpenseSources.push(IncomeExpenseSource.fromFormModel(monthlyIncome.workingTaxCreditSource))
    }

    if(monthlyIncome.hasCouncilTaxSupportSource) {
      incomeExpenseSources.push(IncomeExpenseSource.fromFormModel(monthlyIncome.councilTaxSupportSource))
    }

    if(monthlyIncome.hasPensionSource) {
      incomeExpenseSources.push(IncomeExpenseSource.fromFormModel(monthlyIncome.pensionSource))
    }

    return new IncomeExpenseSources(incomeExpenseSources)
  }
}
