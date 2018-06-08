import { MultiRowForm } from 'forms/models/multiRowForm'
import { IsDefined, ValidateIf } from 'class-validator'
import { ValidationErrors as GlobalValidationErrors } from 'forms/validation/validationErrors'
import * as toBoolean from 'to-boolean'
import { DebtRow } from 'response/form/models/statement-of-means/debtRow'
import { AtLeastOnePopulatedRow } from 'forms/validation/validators/atLeastOnePopulatedRow'

export const INIT_ROW_COUNT: number = 2

export class ValidationErrors {
  static readonly ENTER_AT_LEAST_ONE_ROW: string = 'Enter at least one debt'
}

export class Debts extends MultiRowForm<DebtRow> {

  @IsDefined({ message: GlobalValidationErrors.YES_NO_REQUIRED })
  hasAnyDebts: boolean

  @ValidateIf(o => o.hasAnyDebts === true)
  @AtLeastOnePopulatedRow({ message: ValidationErrors.ENTER_AT_LEAST_ONE_ROW })
  rows: DebtRow[]

  constructor (hasAnyDebts?: boolean, rows?: DebtRow[]) {
    super(rows)
    this.hasAnyDebts = hasAnyDebts
  }

  static fromObject (value?: any): Debts {
    if (!value) {
      return value
    }

    const hasAnyDebts: boolean = value.hasAnyDebts !== undefined ? toBoolean(value.hasAnyDebts) : undefined

    return new Debts(hasAnyDebts, (hasAnyDebts === true && value.rows) ? value.rows.map(DebtRow.fromObject) : [])
  }

  getInitialNumberOfRows (): number {
    return INIT_ROW_COUNT
  }

  createEmptyRow (): DebtRow {
    return DebtRow.empty()
  }

  deserialize (input?: any): Debts {
    if (input) {
      this.hasAnyDebts = input.hasAnyDebts
      this.rows = this.deserializeRows(input.rows)
    }

    return this
  }
}
