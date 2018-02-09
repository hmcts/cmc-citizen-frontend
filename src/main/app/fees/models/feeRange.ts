import { plainToClass, Expose, Type } from 'class-transformer'
import { CurrentVersion } from 'fees/models/currentVersion'
import { SimplifiedFeeRange } from 'fees/models/simplifiedFeeRange'
export class FeeRange {
  @Expose({ name: 'min_range' })
  readonly minRange: number
  @Expose({ name: 'max_range' })
  readonly maxRange: number
  @Expose({ name: 'current_version' })
  @Type(() => CurrentVersion)
  readonly currentVersion: CurrentVersion

  constructor (minRange: number, maxRange: number, currentVersion: CurrentVersion) {
    this.minRange = minRange
    this.maxRange = maxRange
    this.currentVersion = currentVersion
  }

  copy (overrides: FeeRange | Partial<FeeRange>): FeeRange {
    if (overrides === undefined) {
      throw new Error('Overrides object is required')
    }
    return plainToClass(FeeRange, { min_range: this.minRange, max_range: this.maxRange, current_version: { flat_amount: { amount : this.currentVersion.flatAmount.amount }, version: this.currentVersion.version, description: this.currentVersion.description, status: this.currentVersion.status }, ...overrides })
  }

  getSimplifiedFeeRange (): SimplifiedFeeRange {
    let amount: string = this.currentVersion.flatAmount.amount.toString()
    return new SimplifiedFeeRange(this.minRange, this.maxRange, amount)
  }
}
