import { Expose, Type } from 'class-transformer'
import { CurrentVersion } from 'fees/models/currentVersion'

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
}
