import { EmployerRow } from 'features/response/form/models/statement-of-means/employerRow'
import { MultiRowForm } from 'forms/models/multiRowForm'

export class Employers extends MultiRowForm<EmployerRow> {

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
