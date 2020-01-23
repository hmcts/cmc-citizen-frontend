import { IncomeExpenseSchedule } from 'response/form/models/statement-of-means/incomeExpenseSchedule'
import { toNumberOrUndefined } from 'shared/utils/numericUtils'
import { IsDefined, IsIn } from '@hmcts/class-validator'
import { Fractions, IsNotBlank, Min } from '@hmcts/cmc-validators'
import { MonthlyExpenseType } from './monthlyExpenseType'

export const INIT_ROW_COUNT: number = 0

export class ValidationErrors {
  static readonly NAME_REQUIRED = 'Enter other expense source'
  static readonly AMOUNT_REQUIRED = (name: string) => `Enter how much you pay for ${name ? name : MonthlyExpenseType.OTHER.displayValue}`
  static readonly AMOUNT_INVALID_DECIMALS = (name: string) => `Enter a valid ${name ? name : MonthlyExpenseType.OTHER.displayValue} amount, maximum two decimal places`
  static readonly AMOUNT_NON_NEGATIVE_NUMBER_REQUIRED = (name: string) => `Enter a valid ${name ? name : MonthlyExpenseType.OTHER.displayValue} amount, maximum two decimal places`
  static readonly SCHEDULE_SELECT_AN_OPTION = (name: string) => `Select how often you pay for ${name ? name : MonthlyExpenseType.OTHER.displayValue}`
}

function withMessage (buildErrorFn: (name: string) => string) {
  return (args: any): string => {
    const object: ExpenseSource = args.object
    return buildErrorFn(object.name)
  }
}

export class ExpenseSource {

  @IsDefined({ message: ValidationErrors.NAME_REQUIRED })
  @IsNotBlank({ message: ValidationErrors.NAME_REQUIRED })
  name?: string

  @IsDefined({ message: withMessage(ValidationErrors.AMOUNT_REQUIRED) })
  @Fractions(0, 2, { message: withMessage(ValidationErrors.AMOUNT_INVALID_DECIMALS) })
  @Min(0, { message: withMessage(ValidationErrors.AMOUNT_NON_NEGATIVE_NUMBER_REQUIRED) })
  amount?: number

  @IsDefined({ message: withMessage(ValidationErrors.SCHEDULE_SELECT_AN_OPTION) })
  @IsIn(IncomeExpenseSchedule.all(), { message: withMessage(ValidationErrors.SCHEDULE_SELECT_AN_OPTION) })
  schedule?: IncomeExpenseSchedule

  constructor (name?: string, amount?: number, schedule?: IncomeExpenseSchedule) {
    this.name = name
    this.amount = amount
    this.schedule = schedule
  }

  static fromObject (name: string, value?: any): ExpenseSource {
    if (!value) {
      return value
    }

    return new ExpenseSource(
      name,
      toNumberOrUndefined(value.amount),
      IncomeExpenseSchedule.of(value.schedule)
    )
  }

  deserialize (input?: any): ExpenseSource {
    if (input) {
      this.name = input.name
      this.amount = input.amount
      this.schedule = IncomeExpenseSchedule.of(input.schedule ? input.schedule.value : undefined)
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
