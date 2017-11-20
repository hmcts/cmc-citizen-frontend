export class TotalAmount {
  claimAmount: number
  interestAmount: number
  feeAmount: number
  totalAmountTillToday: number

  constructor (claimAmount: number, interestAmount: number, feeAmount: number) {
    this.claimAmount = claimAmount
    this.interestAmount = interestAmount
    this.feeAmount = feeAmount
    this.totalAmountTillToday = this.claimAmount + this.interestAmount + this.feeAmount
  }
}
