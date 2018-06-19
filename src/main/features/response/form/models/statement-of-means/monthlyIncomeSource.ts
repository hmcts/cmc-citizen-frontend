import { IncomeExpenseSchedule } from 'features/response/form/models/statement-of-means/incomeExpenseSchedule'
import { toNumberOrUndefined } from 'shared/utils/numericUtils'
import { IsDefined, IsIn } from 'class-validator'
import { Fractions, Min } from '@hmcts/cmc-validators'
import { ValidationErrors as GlobalValidationErrors } from 'forms/validation/validationErrors'

export const MAX_NUMBER_OF_ROWS: number = 10
export const INIT_ROW_COUNT: number = 0

export class ValidationErrors {
  static readonly AMOUNT_REQUIRED = (name: string) => `${GlobalValidationErrors.AMOUNT_REQUIRED} for $name`
  static readonly AMOUNT_INVALID_DECIMALS = (name: string) => `${GlobalValidationErrors.AMOUNT_INVALID_DECIMALS} for $name`
  static readonly AMOUNT_NON_NEGATIVE_NUMBER_REQUIRED = (name: string) => `${GlobalValidationErrors.NON_NEGATIVE_NUMBER_REQUIRED} for $name`
  static readonly SCHEDULE_SELECT_AN_OPTION = (name: string) => `${GlobalValidationErrors.SELECT_AN_OPTION} for $name`
}

function withMessage(validationError: (string) => string) {
  return (args): string => {
    const object: MonthlyIncomeSource = args.object
    return validationError(object.name)
  }
}

export class MonthlyIncomeSource {

  name: string

  @IsDefined({ message: withMessage(ValidationErrors.AMOUNT_REQUIRED) })
  @Fractions(0, 2, { message: withMessage(ValidationErrors.AMOUNT_INVALID_DECIMALS) })
  @Min(0, { message: withMessage(ValidationErrors.AMOUNT_NON_NEGATIVE_NUMBER_REQUIRED) })
  amount?: number

  @IsDefined({ message: withMessage(ValidationErrors.SCHEDULE_SELECT_AN_OPTION) })
  @IsIn(IncomeExpenseSchedule.all(), { message: withMessage(ValidationErrors.SCHEDULE_SELECT_AN_OPTION) })
  schedule?: IncomeExpenseSchedule

  constructor (name: string, amount?: number, schedule?: IncomeExpenseSchedule) {
    this.name = name
    this.amount = amount
    this.schedule = schedule
  }

  static fromObject (name: string, value?: any): MonthlyIncomeSource {
    if (!value) {
      return value
    }

    return new MonthlyIncomeSource(
      name,
      toNumberOrUndefined(value.amount),
      value.schedule ? IncomeExpenseSchedule.of(value.schedule) : undefined
    )
  }

  deserialize (input?: any): MonthlyIncomeSource {
    if (input) {
      this.amount = input.amount
      this.schedule = input.schedule
    }

    return this
  }
}
