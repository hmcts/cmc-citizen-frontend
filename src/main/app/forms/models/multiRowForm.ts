import { Serializable } from 'models/serializable'
import { ItemInMultiRowForm } from 'forms/models/itemInMultiRowForm'

export abstract class MultiRowForm<T extends ItemInMultiRowForm> implements Serializable<MultiRowForm<T>> {

  rows: T[]

  abstract getMaxNumberOfRows (): number

  abstract createEmptyRow (): T

  abstract deserializeRows (rows: any): T[]

  deserialize (input?: any): MultiRowForm<T> {
    if (input) {
      this.rows = this.deserializeRows(input.rows)
    }

    return this
  }

  appendRow () {
    if (this.canAddMoreRows()) {
      this.rows.push(this.createEmptyRow())
    }
  }

  canAddMoreRows () {
    return this.rows.length < this.getMaxNumberOfRows()
  }

  getPopulatedRowsOnly (): T[] {
    return this.rows.filter(item => !item.isEmpty())
  }

  removeExcessRows () {
    this.rows = this.getPopulatedRowsOnly()

    if (this.rows.length === 0) {
      this.appendRow()
    }
  }
}
