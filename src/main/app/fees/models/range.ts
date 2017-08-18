import 'reflect-metadata'
import { plainToClass, Type } from 'class-transformer'

import { Fee } from 'app/fees/models/fee'

export class Range {
  readonly from: number
  readonly to: number
  @Type(() => Fee)
  readonly fee: Fee

  constructor (from: number, to: number, fee: Fee) {
    this.from = from
    this.to = to
    this.fee = fee
  }

  copy (overrides: Range | Partial<Range>): Range {
    if (overrides === undefined) {
      throw new Error('Overrides object is required')
    }

    return plainToClass(Range, { from: this.from, to: this.to, fee: this.fee, ...overrides })
  }
}
