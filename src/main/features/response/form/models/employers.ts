import { ValidateNested } from 'class-validator'

import { Serializable } from 'models/serializable'
import { EmployerRow } from 'response/form/models/employerRow'

export const INIT_ROW_COUNT: number = 1
export const MAX_NUMBER_OF_JOBS: number = 20

export class Employers implements Serializable<Employers> {
  readonly type: string = 'breakdown'

  @ValidateNested({ each: true })
  rows: EmployerRow[]

  constructor (rows: EmployerRow[] = Employers.initialRows()) {
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

  deserialize (input?: any): Employers {
    if (input) {
      this.rows = this.deserializeRows(input.rows)
    }

    return this
  }

  appendRow () {
    if (this.canAddMoreRows()) {
      this.rows.push(EmployerRow.empty())
    }
  }

  removeExcessRows () {
    this.rows = this.rows.filter(item => !!item.jobTitle && !!item.employerName)

    if (this.rows.length === 0) {
      this.appendRow()
    }
  }

  canAddMoreRows () {
    return this.rows.length < MAX_NUMBER_OF_JOBS
  }

  private deserializeRows (rows: any): EmployerRow[] {
    if (!rows) {
      return Employers.initialRows()
    }

    let employerRows: EmployerRow[] = rows.map(row => new EmployerRow().deserialize(row))

    if (rows.length < INIT_ROW_COUNT) {
      employerRows = employerRows.concat(Employers.initialRows(INIT_ROW_COUNT - rows.length))
    }

    return employerRows
  }

}
