import { Serializable } from 'models/serializable'
import { MultiRowFormItem } from 'forms/models/multiRowFormItem'
import { ValidateNested } from 'class-validator'

export const MAX_NUMBER_OF_ROWS: number = 20
export const INIT_ROW_COUNT: number = 1

export abstract class MultiRowForm<T extends MultiRowFormItem> implements Serializable<MultiRowForm<T>> {

  @ValidateNested({ each: true })
  rows: T[]

  constructor (rows?: T[]) {
    this.rows = rows || this.initialRows()
  }

  abstract createEmptyRow (): T

  appendRow () {
    if (this.canAddMoreRows()) {
      this.rows.push(this.createEmptyRow())
    }
  }

  canAddMoreRows () {
    return this.rows.length < this.getMaxNumberOfRows()
  }

  deserialize (input?: any): MultiRowForm<T> {
    if (input) {
      this.rows = this.deserializeRows(input.rows)
    }

    return this
  }

  deserializeRows (rows: any): T[] {
    if (!rows) {
      return this.initialRows()
    }

    let employerRows: T[] = rows.map(row => this.createEmptyRow().deserialize(row))

    if (rows.length < this.getInitialNumberOfRows()) {
      employerRows = employerRows.concat(this.initialRows(this.getInitialNumberOfRows() - rows.length))
    }

    return employerRows
  }

  getInitialNumberOfRows (): number {
    return INIT_ROW_COUNT
  }

  getMaxNumberOfRows (): number {
    return MAX_NUMBER_OF_ROWS
  }

  getPopulatedRowsOnly (): T[] {
    return this.rows.filter(item => !item.isEmpty())
  }

  initialRows (rows?: number): T[] {
    return new Array(rows || this.getInitialNumberOfRows()).fill(this.createEmptyRow())
  }

  removeExcessRows () {
    this.rows = this.getPopulatedRowsOnly()

    if (this.rows.length === 0) {
      this.appendRow()
    }
  }
}
