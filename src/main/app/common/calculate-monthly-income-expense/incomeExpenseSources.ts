import { IsArray, ValidateNested } from '@hmcts/class-validator'
import { IncomeExpenseSource } from 'common/calculate-monthly-income-expense/incomeExpenseSource'
import { MonthlyIncome } from 'response/form/models/statement-of-means/monthlyIncome'
import { MonthlyExpenses } from 'response/form/models/statement-of-means/monthlyExpenses'
import { PriorityDebt } from 'response/form/models/statement-of-means/priorityDebt'

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

    if (!Array.isArray(value.incomeExpenseSources)) {
      throw new Error('Invalid value: missing array')
    }

    return new IncomeExpenseSources(value.incomeExpenseSources.map(
      incomeExpenseSource => IncomeExpenseSource.fromObject(incomeExpenseSource)
    ))
  }

  static fromMonthlyExpensesFormModel (monthlyExpenses: MonthlyExpenses): IncomeExpenseSources {
    if (!monthlyExpenses) {
      return undefined
    }

    const incomeExpenseSources = []

    if (monthlyExpenses.mortgage && monthlyExpenses.mortgage.populated) {
      incomeExpenseSources.push(IncomeExpenseSource.fromFormExpenseSource(monthlyExpenses.mortgage))
    }

    if (monthlyExpenses.rent && monthlyExpenses.rent.populated) {
      incomeExpenseSources.push(IncomeExpenseSource.fromFormExpenseSource(monthlyExpenses.rent))
    }

    if (monthlyExpenses.councilTax && monthlyExpenses.councilTax.populated) {
      incomeExpenseSources.push(IncomeExpenseSource.fromFormExpenseSource(monthlyExpenses.councilTax))
    }

    if (monthlyExpenses.gas && monthlyExpenses.gas.populated) {
      incomeExpenseSources.push(IncomeExpenseSource.fromFormExpenseSource(monthlyExpenses.gas))
    }

    if (monthlyExpenses.electricity && monthlyExpenses.electricity.populated) {
      incomeExpenseSources.push(IncomeExpenseSource.fromFormExpenseSource(monthlyExpenses.electricity))
    }

    if (monthlyExpenses.water && monthlyExpenses.water.populated) {
      incomeExpenseSources.push(IncomeExpenseSource.fromFormExpenseSource(monthlyExpenses.water))
    }

    if (monthlyExpenses.travel && monthlyExpenses.travel.populated) {
      incomeExpenseSources.push(IncomeExpenseSource.fromFormExpenseSource(monthlyExpenses.travel))
    }

    if (monthlyExpenses.schoolCosts && monthlyExpenses.schoolCosts.populated) {
      incomeExpenseSources.push(IncomeExpenseSource.fromFormExpenseSource(monthlyExpenses.schoolCosts))
    }

    if (monthlyExpenses.foodAndHousekeeping && monthlyExpenses.foodAndHousekeeping.populated) {
      incomeExpenseSources.push(IncomeExpenseSource.fromFormExpenseSource(monthlyExpenses.foodAndHousekeeping))
    }

    if (monthlyExpenses.tvAndBroadband && monthlyExpenses.tvAndBroadband.populated) {
      incomeExpenseSources.push(IncomeExpenseSource.fromFormExpenseSource(monthlyExpenses.tvAndBroadband))
    }

    if (monthlyExpenses.hirePurchase && monthlyExpenses.hirePurchase.populated) {
      incomeExpenseSources.push(IncomeExpenseSource.fromFormExpenseSource(monthlyExpenses.hirePurchase))
    }

    if (monthlyExpenses.mobilePhone && monthlyExpenses.mobilePhone.populated) {
      incomeExpenseSources.push(IncomeExpenseSource.fromFormExpenseSource(monthlyExpenses.mobilePhone))
    }

    if (monthlyExpenses.maintenance && monthlyExpenses.maintenance.populated) {
      incomeExpenseSources.push(IncomeExpenseSource.fromFormExpenseSource(monthlyExpenses.maintenance))
    }

    if (monthlyExpenses.anyOtherPopulated) {
      incomeExpenseSources.push(...monthlyExpenses.other
        .filter(source => source.populated)
        .map(source => IncomeExpenseSource.fromFormExpenseSource(source)))
    }

    return new IncomeExpenseSources(incomeExpenseSources)
  }

  static fromMonthlyIncomeFormModel (monthlyIncome: MonthlyIncome): IncomeExpenseSources {
    if (!monthlyIncome) {
      return undefined
    }

    const incomeExpenseSources = []

    if (monthlyIncome.salarySource && monthlyIncome.salarySource.populated) {
      incomeExpenseSources.push(IncomeExpenseSource.fromFormIncomeSource(monthlyIncome.salarySource))
    }

    if (monthlyIncome.universalCreditSource && monthlyIncome.universalCreditSource.populated) {
      incomeExpenseSources.push(IncomeExpenseSource.fromFormIncomeSource(monthlyIncome.universalCreditSource))
    }

    if (monthlyIncome.jobseekerAllowanceIncomeSource && monthlyIncome.jobseekerAllowanceIncomeSource.populated) {
      incomeExpenseSources.push(IncomeExpenseSource.fromFormIncomeSource(monthlyIncome.jobseekerAllowanceIncomeSource))
    }

    if (monthlyIncome.jobseekerAllowanceContributionSource && monthlyIncome.jobseekerAllowanceContributionSource.populated) {
      incomeExpenseSources.push(IncomeExpenseSource.fromFormIncomeSource(monthlyIncome.jobseekerAllowanceContributionSource))
    }

    if (monthlyIncome.incomeSupportSource && monthlyIncome.incomeSupportSource.populated) {
      incomeExpenseSources.push(IncomeExpenseSource.fromFormIncomeSource(monthlyIncome.incomeSupportSource))
    }

    if (monthlyIncome.workingTaxCreditSource && monthlyIncome.workingTaxCreditSource.populated) {
      incomeExpenseSources.push(IncomeExpenseSource.fromFormIncomeSource(monthlyIncome.workingTaxCreditSource))
    }

    if (monthlyIncome.childTaxCreditSource && monthlyIncome.childTaxCreditSource.populated) {
      incomeExpenseSources.push(IncomeExpenseSource.fromFormIncomeSource(monthlyIncome.childTaxCreditSource))
    }

    if (monthlyIncome.childBenefitSource && monthlyIncome.childBenefitSource.populated) {
      incomeExpenseSources.push(IncomeExpenseSource.fromFormIncomeSource(monthlyIncome.childBenefitSource))
    }

    if (monthlyIncome.councilTaxSupportSource && monthlyIncome.councilTaxSupportSource.populated) {
      incomeExpenseSources.push(IncomeExpenseSource.fromFormIncomeSource(monthlyIncome.councilTaxSupportSource))
    }

    if (monthlyIncome.pensionSource && monthlyIncome.pensionSource.populated) {
      incomeExpenseSources.push(IncomeExpenseSource.fromFormIncomeSource(monthlyIncome.pensionSource))
    }

    if (monthlyIncome.anyOtherIncomePopulated) {
      incomeExpenseSources.push(...monthlyIncome.otherSources
        .filter(source => source.populated)
        .map(source => IncomeExpenseSource.fromFormIncomeSource(source)))
    }
    return new IncomeExpenseSources(incomeExpenseSources)
  }

  static fromPriorityDebtModel (priorityDebt: PriorityDebt): IncomeExpenseSources {
    if (!priorityDebt) {
      return undefined
    }

    const incomeExpenseSources = []

    if (priorityDebt.mortgage && priorityDebt.mortgage.populated) {
      incomeExpenseSources.push(IncomeExpenseSource.fromFormExpenseSource(priorityDebt.mortgage))
    }

    if (priorityDebt.rent && priorityDebt.rent.populated) {
      incomeExpenseSources.push(IncomeExpenseSource.fromFormExpenseSource(priorityDebt.rent))
    }

    if (priorityDebt.councilTax && priorityDebt.councilTax.populated) {
      incomeExpenseSources.push(IncomeExpenseSource.fromFormExpenseSource(priorityDebt.councilTax))
    }

    if (priorityDebt.gas && priorityDebt.gas.populated) {
      incomeExpenseSources.push(IncomeExpenseSource.fromFormExpenseSource(priorityDebt.gas))
    }

    if (priorityDebt.electricity && priorityDebt.electricity.populated) {
      incomeExpenseSources.push(IncomeExpenseSource.fromFormExpenseSource(priorityDebt.electricity))
    }

    if (priorityDebt.water && priorityDebt.water.populated) {
      incomeExpenseSources.push(IncomeExpenseSource.fromFormExpenseSource(priorityDebt.water))
    }

    if (priorityDebt.maintenance && priorityDebt.maintenance.populated) {
      incomeExpenseSources.push(IncomeExpenseSource.fromFormExpenseSource(priorityDebt.maintenance))
    }

    return new IncomeExpenseSources(incomeExpenseSources)
  }
}
