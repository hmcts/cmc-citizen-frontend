import 'reflect-metadata'
import { Expose, Type } from 'class-transformer'
import { FlatAmount } from 'fees/models/flatAmount'

export class CurrentVersion {
  readonly version: number
  readonly description: string
  readonly status: string
  @Expose({ name: 'flat_amount' })
  @Type(() => FlatAmount)
  readonly flatAmount: FlatAmount

  constructor (version: number, description: string, status: string, flatAmount: FlatAmount) {
    this.version = version
    this.description = description
    this.status = status
    this.flatAmount = flatAmount
  }
}
