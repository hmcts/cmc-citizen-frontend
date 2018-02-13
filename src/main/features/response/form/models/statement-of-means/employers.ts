import { EmployerRow } from 'features/response/form/models/statement-of-means/employerRow'
import { MultiRowForm } from 'forms/models/multiRowForm'
import { AtLeastOnePopulatedRow } from 'forms/validation/validators/atLeastOnePopulatedRow'

export class ValidationErrors {
  static readonly ENTER_AT_LEAST_ONE_ROW: string = 'Enter at least one employer'
}

export class Employers extends MultiRowForm<EmployerRow> {

  @AtLeastOnePopulatedRow({ message: ValidationErrors.ENTER_AT_LEAST_ONE_ROW })
  rows: EmployerRow[]

  static fromObject (value?: any): Employers {
    if (!value) {
      return value
    }

    return new Employers(value.rows ? value.rows.map(EmployerRow.fromObject) : [])
  }

  createEmptyRow (): EmployerRow {
    return new EmployerRow(undefined, undefined)
  }
}
