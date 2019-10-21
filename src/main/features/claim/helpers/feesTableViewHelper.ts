import { FeesClient } from 'fees/feesClient'
import { FeeRange as MergeableRange } from 'claim/helpers/feesTableViewHelper'
import { FeeRange as ViewFeeRange } from 'fees/models/feeRange'

const supportedFeeLimitInGBP: number = 10000

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

export class FeeRange implements RangePartial {
  constructor (public readonly minRange: number, public readonly maxRange: number, public readonly amount: number | string) {}
}

export class FeeRangeMerge implements RangePartial {
  constructor (public readonly minRange: number, public readonly maxRange: number, private readonly fees: { [key: string]: number | string } = {}) {}

  addFee (key: number, value: number | string): void {
    this.fees[key] = value
  }
}

export class FeesTableViewHelper {
  static merge (firstFeesSet: FeeRange[], secondFeesSet: FeeRange[], increment: number = 0.01): FeeRangeMerge[] {
    if (firstFeesSet === undefined || secondFeesSet === undefined) {
      throw new Error('Both fee sets are required for merge')
    }
    const items: Item[] = [
        ...firstFeesSet.map(range => Item.createForFeeInColumn(range, 1)),
      ...secondFeesSet.map(range => Item.createForFeeInColumn(range, 2))
    ].sort((lhs: Item, rhs: Item) => RangeUtils.compare(lhs.range, rhs.range))

    return items.reduce((feeRangeMerge: FeeRangeMerge[], item: Item) => {
      const overlappedRows: FeeRangeMerge[] = feeRangeMerge.filter((row: FeeRangeMerge) => RangeUtils.areOverlap(item.range, row))
      if (item.range.amount === undefined) {
        throw new Error('Fee amount must be defined')
      }
      if (overlappedRows.length === 0) {
        feeRangeMerge.push(new FeeRangeMerge(item.range.minRange, item.range.maxRange, { [item.targetColumn]: item.range.amount }))
      } else {
        overlappedRows.forEach(row => {
          row.addFee(item.targetColumn, item.range.amount)
          if (!RangeUtils.areSame(row, item.range)) {
            feeRangeMerge.push(new FeeRangeMerge(row.maxRange + increment, item.range.maxRange, { [item.targetColumn]: item.range.amount }))
          }
        })
      }

      return feeRangeMerge
    }, []).sort(RangeUtils.compare)
  }

  static async feesTableContent (): Promise<FeeRangeMerge[]> {
    const issueFeeRangeGroup: ViewFeeRange[] = await FeesClient.getIssueFeeRangeGroup()
    const hearingFeeRangeGroup: ViewFeeRange[] = await FeesClient.getHearingFeeRangeGroup()

    const supportedIssueFees: MergeableRange[] = issueFeeRangeGroup
      .filter((range: ViewFeeRange) => range.minRange < supportedFeeLimitInGBP)
      .map((range: ViewFeeRange) => new MergeableRange(
        range.minRange, Math.min(range.maxRange, supportedFeeLimitInGBP), range.currentVersion.flatAmount.amount)
      )
    const supportedHearingFees: MergeableRange[] = hearingFeeRangeGroup
      .filter((range: ViewFeeRange) => range.minRange < supportedFeeLimitInGBP)
      .map((range: ViewFeeRange) => new MergeableRange(
        range.minRange, Math.min(range.maxRange, supportedFeeLimitInGBP), range.currentVersion.flatAmount.amount)
      )

    return this.merge(supportedIssueFees, supportedHearingFees)
  }
}
