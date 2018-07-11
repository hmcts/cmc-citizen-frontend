import { ExpenseSchedule } from 'response/form/models/statement-of-means/expenseSchedule'
import { toNumberOrUndefined } from 'shared/utils/numericUtils'
import { IsDefined, IsIn } from 'class-validator'
import { Fractions, IsNotBlank, Min } from '@hmcts/cmc-validators'

export const INIT_ROW_COUNT: number = 0

export class ValidationErrors {
  static readonly NAME_REQUIRED = 'Enter source of income'
  static readonly AMOUNT_REQUIRED = (name: string) => `Enter how much ${name ? name : 'income'} you receive`
  static readonly AMOUNT_INVALID_DECIMALS = (name: string) => `Enter a valid ${name ? name : 'income'} amount, maximum two decimal places`
  static readonly AMOUNT_NON_NEGATIVE_NUMBER_REQUIRED = (name: string) => `Enter a valid ${name ? name : 'income'} amount, maximum two decimal places`
  static readonly SCHEDULE_SELECT_AN_OPTION = (name: string) => `Select how often you receive ${name ? name : 'income'}`
}

function withMessage (buildErrorFn: (name: string) => string) {
  return (args: any): string => {
    const object: IncomeExpenseSource = args.object
    return buildErrorFn(object.name)
  }
}

export class IncomeExpenseSource {

  @IsDefined({ message: ValidationErrors.NAME_REQUIRED })
  @IsNotBlank({ message: ValidationErrors.NAME_REQUIRED })
  name?: string

  @IsDefined({ message: withMessage(ValidationErrors.AMOUNT_REQUIRED) })
  @Fractions(0, 2, { message: withMessage(ValidationErrors.AMOUNT_INVALID_DECIMALS) })
  @Min(0, { message: withMessage(ValidationErrors.AMOUNT_NON_NEGATIVE_NUMBER_REQUIRED) })
  amount?: number

  @IsDefined({ message: withMessage(ValidationErrors.SCHEDULE_SELECT_AN_OPTION) })
  @IsIn(ExpenseSchedule.all(), { message: withMessage(ValidationErrors.SCHEDULE_SELECT_AN_OPTION) })
  schedule?: ExpenseSchedule

  constructor (name?: string, amount?: number, schedule?: ExpenseSchedule) {
    this.name = name
    this.amount = amount
    this.schedule = schedule
  }

  static fromObject (name: string, value?: any): IncomeExpenseSource {
    if (!value) {
      return value
    }

    return new IncomeExpenseSource(
      name,
      toNumberOrUndefined(value.amount),
      ExpenseSchedule.of(value.schedule)
    )
  }

  deserialize (input?: any): IncomeExpenseSource {
    if (input) {
      this.name = input.name
      this.amount = input.amount
      this.schedule = ExpenseSchedule.of(input.schedule ? input.schedule.value : undefined)
    }

    return this
  }

  get populated (): boolean {
    return !!this.amount || !!this.schedule
  }

  reset (): void {
    this.name = this.amount = this.schedule = undefined
  }

}
