import { IncomeExpenseSchedule } from 'common/calculate-monthly-income-expense/incomeExpenseSchedule'
import { toNumberOrUndefined } from 'main/common/utils/numericUtils'
import { ValidationErrors as GlobalValidationErrors } from 'forms/validation/validationErrors'
import { IsDefined, IsIn, IsPositive } from '@hmcts/class-validator'
import { Fractions } from '@hmcts/cmc-validators'
import { Income } from 'claims/models/response/statement-of-means/income'
import { Expense } from 'claims/models/response/statement-of-means/expense'
import { IncomeSource as FormIncomeSource } from 'response/form/models/statement-of-means/incomeSource'
import { ExpenseSource as FormExpenseSource } from 'response/form/models/statement-of-means/expenseSource'

export class IncomeExpenseSource {

  @IsDefined({ message: GlobalValidationErrors.NUMBER_REQUIRED })
  @Fractions(0, 2, { message: GlobalValidationErrors.AMOUNT_INVALID_DECIMALS })
  @IsPositive({ message: GlobalValidationErrors.POSITIVE_NUMBER_REQUIRED })
  amount?: number

  @IsIn(IncomeExpenseSchedule.all(), { message: GlobalValidationErrors.SELECT_AN_OPTION })
  schedule?: IncomeExpenseSchedule

  constructor (amount?: number, incomeExpenseSchedule?: IncomeExpenseSchedule) {
    this.amount = amount
    this.schedule = incomeExpenseSchedule
  }

  static fromObject (value?: any): IncomeExpenseSource {
    if (!value) {
      return value
    }

    return new IncomeExpenseSource(
      toNumberOrUndefined(value.amount),
      toIncomeExpenseScheduleOrUndefined(value.schedule)
    )
  }

  static fromFormIncomeSource (incomeSource: FormIncomeSource): IncomeExpenseSource {
    if (!incomeSource) {
      return undefined
    }

    const schedule = incomeSource.schedule ? incomeSource.schedule.value : undefined

    return new IncomeExpenseSource(
      toNumberOrUndefined(incomeSource.amount),
      toIncomeExpenseScheduleOrUndefined(schedule)
    )
  }

  static fromFormExpenseSource (expenseSource: FormExpenseSource): IncomeExpenseSource {
    if (!expenseSource) {
      return undefined
    }

    const schedule = expenseSource.schedule ? expenseSource.schedule.value : undefined

    return new IncomeExpenseSource(
      toNumberOrUndefined(expenseSource.amount),
      toIncomeExpenseScheduleOrUndefined(schedule)
    )
  }

  static fromClaimIncome (income: Income): IncomeExpenseSource {
    if (!income) {
      return undefined
    }

    return new IncomeExpenseSource(
      toNumberOrUndefined(income.amount),
      toIncomeExpenseScheduleOrUndefined(income.frequency)
    )
  }

  static fromClaimExpense (expense: Expense): IncomeExpenseSource {
    if (!expense) {
      return undefined
    }

    return new IncomeExpenseSource(
      toNumberOrUndefined(expense.amount),
      toIncomeExpenseScheduleOrUndefined(expense.frequency)
    )
  }
}

function toIncomeExpenseScheduleOrUndefined (value?: string): IncomeExpenseSchedule {
  try {
    return IncomeExpenseSchedule.of(value)
  } catch (error) {
    return undefined
  }
}
