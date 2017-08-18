import 'reflect-metadata'
import { Type } from 'class-transformer'

import { Range } from 'app/fees/models/range'

export class RangeGroup {
  readonly code: string
  readonly description: string
  @Type(() => Range)
  readonly ranges: Range[]

  constructor (code: string, description: string, ranges: Range[]) {
    this.code = code
    this.description = description
    this.ranges = ranges
  }
}
