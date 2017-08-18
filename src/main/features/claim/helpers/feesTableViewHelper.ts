import { Range } from 'fees/models/range'

interface RangePartial {
  from: number
  to: number
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
    return lhs.to - rhs.to || lhs.from - rhs.from
  }

  /**
   * Checks if two ranges are exactly the same (perfect overlap).
   *
   * @param {RangePartial} lhs left hand side range
   * @param {RangePartial} rhs right hand side range
   * @returns {boolean} true if ranges overlap, otherwise false
   */
  static areSame (lhs: RangePartial, rhs: RangePartial): boolean {
    return lhs.from === rhs.from && lhs.to === rhs.to
  }

  /**
   * Checks if two ranges overlap in any way.
   *
   * @param {RangePartial} lhs left hand side range
   * @param {RangePartial} rhs right hand side range
   * @returns {boolean} true if ranges overlap, otherwise false
   */
  static areOverlap (lhs: RangePartial, rhs: RangePartial): boolean {
    return (lhs.from <= rhs.from && lhs.to >= rhs.from) || (lhs.from <= rhs.to && lhs.to >= rhs.to) || (lhs.from <= rhs.from && lhs.to >= rhs.to)
  }
}

class Item {
  constructor (public readonly range: Range, public readonly targetColumn: number) {}

  static createForFeeInColumn (range: Range, targetColumn: number): Item {
    return new Item(range, targetColumn)
  }
}

export class Row {
  constructor (public readonly from: number, public readonly to: number, private readonly fees: { [key: number]: number } = {}) {}

  addFee (key: number, value: number): void {
    this.fees[key] = value
  }
}

export class FeesTableViewHelper {
  static merge (firstFeesSet: Range[], secondFeesSet: Range[], increment: number = 1): Row[] {
    if (firstFeesSet === undefined || secondFeesSet === undefined) {
      throw new Error('Both fee sets are required for merge')
    }

    const items: Item[] = [
        ...firstFeesSet.map(range => Item.createForFeeInColumn(range, 1)),
      ...secondFeesSet.map(range => Item.createForFeeInColumn(range, 2))
    ].sort((lhs: Item, rhs: Item) => RangeUtils.compare(lhs.range, rhs.range))

    return items.reduce((rows: Row[], item: Item) => {
      const overlappedRows: Row[] = rows.filter((row: Row) => RangeUtils.areOverlap(item.range, row))

      if (overlappedRows.length === 0) {
        rows.push(new Row(item.range.from, item.range.to, { [item.targetColumn]: item.range.fee.amount }))
      } else {
        overlappedRows.forEach(row => {
          row.addFee(item.targetColumn, item.range.fee.amount)
          if (!RangeUtils.areSame(row, item.range)) {
            rows.push(new Row(row.to + increment, item.range.to, { [item.targetColumn]: item.range.fee.amount }))
          }
        })
      }

      return rows
    }, []).sort(RangeUtils.compare)
  }
}
