export class SimplifiedFeeRange {
  minRange: number
  maxRange: number
  feeAmount: string

  constructor (minRange: number, maxRange: number, feeAmount: string) {
    this.minRange = minRange
    this.maxRange = maxRange
    this.feeAmount = feeAmount
  }

}
