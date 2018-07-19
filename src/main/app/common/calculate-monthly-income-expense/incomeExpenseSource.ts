import { IncomeExpenseSchedule } from 'common/calculate-monthly-income-expense/incomeExpenseSchedule'
import { toNumberOrUndefined } from 'main/common/utils/numericUtils'
import { ValidationErrors as GlobalValidationErrors } from 'forms/validation/validationErrors'
import { IsDefined, IsIn, IsPositive } from 'class-validator'
import { Fractions } from '@hmcts/cmc-validators'
import { IncomeExpenseSource as FormIncomeExpenseSource } from 'response/form/models/statement-of-means/incomeExpenseSource'
import { Income } from 'claims/models/response/statement-of-means/income'
import { Expense } from 'claims/models/response/statement-of-means/expense'

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

  static fromFormModel (incomeSource: FormIncomeExpenseSource): IncomeExpenseSource {
    if (!incomeSource) {
      return undefined
    }

    const schedule = incomeSource.schedule ? incomeSource.schedule.value : undefined

    return new IncomeExpenseSource(
      toNumberOrUndefined(incomeSource.amount),
      toIncomeExpenseScheduleOrUndefined(schedule)
    )
  }

  static fromClaimIncome (income: Income): IncomeExpenseSource {
    if (!income) {
      return undefined
    }

    const schedule: string = income.frequency ? income.frequency : undefined

    return new IncomeExpenseSource(
      toNumberOrUndefined(income.amountReceived),
      toIncomeExpenseScheduleOrUndefined(schedule)
    )
  }

  static fromClaimExpense (expense: Expense): IncomeExpenseSource {
    if (!expense) {
      return undefined
    }

    const schedule: string = expense.frequency ? expense.frequency : undefined

    return new IncomeExpenseSource(
      toNumberOrUndefined(expense.amountPaid),
      toIncomeExpenseScheduleOrUndefined(schedule)
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
