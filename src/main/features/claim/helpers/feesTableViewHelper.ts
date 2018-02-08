import { FeeRange } from 'fees/models/feeRange'
import { isUndefined } from 'util'

interface RangePartial {
  minRange: number
  maxRange: number
}

class RangeUtils {
  /**
   * Compares two ranges.
   *
   * @param {RangePartial} lhs left hand side range
   * @param {RangePartial} rhs right hand side range
   * @returns {number} 0 if equal, other value it not
   */
  static compare (lhs: RangePartial, rhs: RangePartial): number {
    return lhs.maxRange - rhs.maxRange || lhs.minRange - rhs.minRange
  }

  /**
   * Checks if two ranges are exactly the same (perfect overlap).
   *
   * @param {RangePartial} lhs left hand side range
   * @param {RangePartial} rhs right hand side range
   * @returns {boolean} true if ranges overlap, otherwise false
   */
  static areSame (lhs: RangePartial, rhs: RangePartial): boolean {
    return lhs.minRange === rhs.minRange && lhs.maxRange === rhs.maxRange
  }

  /**
   * Checks if two ranges overlap in any way.
   *
   * @param {RangePartial} lhs left hand side range
   * @param {RangePartial} rhs right hand side range
   * @returns {boolean} true if ranges overlap, otherwise false
   */
  static areOverlap (lhs: RangePartial, rhs: RangePartial): boolean {
    return (lhs.minRange <= rhs.minRange && lhs.maxRange >= rhs.minRange) || (lhs.minRange <= rhs.maxRange && lhs.maxRange >= rhs.maxRange) || (lhs.minRange <= rhs.minRange && lhs.maxRange >= rhs.maxRange)
  }

}

class Item {
  constructor (public readonly range: FeeRange, public readonly targetColumn: number) {}

  static createForFeeInColumn (range: FeeRange, targetColumn: number): Item {
    return new Item(range, targetColumn)
  }
}

export class Row {
  constructor (public readonly minRange: number, public readonly maxRange: number, private readonly fees: { [key: string]: string } = {}) {}

  addFee (key: number, value: string): void {
    this.fees[key] = value
  }
}

export class FeesTableViewHelper {
  static merge (firstFeesSet: FeeRange[], secondFeesSet: FeeRange[], increment: number = 1): Row[] {
    if (firstFeesSet === undefined || secondFeesSet === undefined) {
      throw new Error('Both fee sets are required for merge')
    }

    const items: Item[] = [
        ...firstFeesSet.map(range => Item.createForFeeInColumn(range, 1)),
      ...secondFeesSet.map(range => Item.createForFeeInColumn(range, 2))
    ].sort((lhs: Item, rhs: Item) => RangeUtils.compare(lhs.range, rhs.range))

    return items.reduce((rows: Row[], item: Item) => {
      const overlappedRows: Row[] = rows.filter((row: Row) => RangeUtils.areOverlap(item.range, row))
      let feeAmount = item.range.currentVersion.flatAmount.amount
      if (isUndefined(feeAmount)) {
        throw new Error('Fee amount must be defined')
      }
      if (overlappedRows.length === 0) {
        rows.push(new Row(item.range.minRange, item.range.maxRange, { [item.targetColumn]: feeAmount.toString() }))
      } else {
        overlappedRows.forEach(row => {
          row.addFee(item.targetColumn, feeAmount.toString())
          if (!RangeUtils.areSame(row, item.range)) {
            rows.push(new Row(row.maxRange + increment, item.range.maxRange, { [item.targetColumn]: feeAmount.toString() }))
          }
        })
      }

      return rows
    }, []).sort(RangeUtils.compare)
  }
}
