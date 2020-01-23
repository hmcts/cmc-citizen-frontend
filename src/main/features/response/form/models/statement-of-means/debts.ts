import { MultiRowForm } from 'forms/models/multiRowForm'
import { IsDefined, ValidateIf } from '@hmcts/class-validator'
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
  declared: boolean

  @ValidateIf(o => o.declared === true)
  @AtLeastOnePopulatedRow({ message: ValidationErrors.ENTER_AT_LEAST_ONE_ROW })
  rows: DebtRow[]

  constructor (declared?: boolean, rows?: DebtRow[]) {
    super(rows)
    this.declared = declared
  }

  static fromObject (value?: any): Debts {
    if (!value) {
      return value
    }

    const declared: boolean = value.declared !== undefined ? toBoolean(value.declared) : undefined

    return new Debts(
      declared,
      (declared === true && value.rows) ? value.rows.map(DebtRow.fromObject) : [])
  }

  getInitialNumberOfRows (): number {
    return INIT_ROW_COUNT
  }

  createEmptyRow (): DebtRow {
    return DebtRow.empty()
  }

  deserialize (input?: any): Debts {
    if (input) {
      this.declared = input.declared
      this.rows = this.deserializeRows(input.rows)
    }

    return this
  }
}
