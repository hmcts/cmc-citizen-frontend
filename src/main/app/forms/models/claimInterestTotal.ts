export default class InterestTotal {
  claimAmount: number
  interestAmount: number
  feeAmount: number

  constructor (claimAmount: number, interestAmount: number, feeAmount: number) {
    this.claimAmount = claimAmount
    this.interestAmount = interestAmount
    this.feeAmount = feeAmount
  }

  get totalAmount () {
    return this.claimAmount + this.interestAmount + this.feeAmount
  }
}
