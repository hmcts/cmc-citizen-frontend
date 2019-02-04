import { MultiRowFormItem } from 'forms/models/multiRowFormItem'
import { ValidateNested } from '@hmcts/class-validator'

export const MAX_NUMBER_OF_ROWS: number = 1000
export const INIT_ROW_COUNT: number = 1

export abstract class MultiRowForm<T extends MultiRowFormItem> {

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

    let deserialisedRows: T[] = rows.map(row => this.createEmptyRow().deserialize(row))

    if (rows.length < this.getInitialNumberOfRows()) {
      deserialisedRows = deserialisedRows.concat(this.initialRows(this.getInitialNumberOfRows() - rows.length))
    }

    return deserialisedRows
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
  }
}
