import { Expose } from 'class-transformer'

export class FeeOutcome {
  readonly code: string
  readonly description: string
  @Expose({ name: 'fee_amount' })
  readonly amount: number
  readonly version: number

  // deserialize (input: any): FeeOutcome {
  //   if (input) {
  //     this.code = input.code
  //     this.description = input.description
  //     this.version = input.version
  //     this.amount = input.fee_amount
  //   }
  //   return this
  // }
}
