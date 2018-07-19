import { Expose } from 'class-transformer'

export class FeeOutcome {
  readonly code: string
  readonly description: string
  @Expose({ name: 'fee_amount' })
  readonly amount: number
  readonly version: number | string // fees use number, pay use string
}
