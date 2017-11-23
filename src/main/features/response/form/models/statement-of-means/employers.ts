import { ValidateNested } from 'class-validator'

import { EmployerRow } from 'features/response/form/models/statement-of-means/employerRow'
import { MultiRowForm } from 'forms/models/multiRowForm'

export const INIT_ROW_COUNT: number = 1
export const MAX_NUMBER_OF_JOBS: number = 20

export class Employers extends MultiRowForm<EmployerRow> {

  @ValidateNested({ each: true })
  rows: EmployerRow[]

  constructor (rows: EmployerRow[] = Employers.initialRows()) {
    super()
    this.rows = rows
  }

  static fromObject (value?: any): Employers {
    if (!value) {
      return value
    }

    return new Employers(value.rows ? value.rows.map(EmployerRow.fromObject) : [])
  }

  private static initialRows (rows: number = INIT_ROW_COUNT): EmployerRow[] {
    return new Array(rows).fill(EmployerRow.empty())
  }

  getMaxNumberOfRows (): number {
    return MAX_NUMBER_OF_JOBS
  }

  deserializeRows (rows: any): EmployerRow[] {
    if (!rows) {
      return Employers.initialRows()
    }

    let employerRows: EmployerRow[] = rows.map(row => new EmployerRow().deserialize(row))

    if (rows.length < INIT_ROW_COUNT) {
      employerRows = employerRows.concat(Employers.initialRows(INIT_ROW_COUNT - rows.length))
    }

    return employerRows
  }

  createEmptyRow (): EmployerRow {
    return new EmployerRow(undefined, undefined)
  }
}
