import 'reflect-metadata'
import { Type } from 'class-transformer'

import { Fee } from 'app/fees/models/fee'

export class CalculationOutcome {
  readonly amount: number
  @Type(() => Fee)
  readonly fee: Fee

  constructor (amount: number, fee: Fee) {
    this.amount = amount
    this.fee = fee
  }
}
