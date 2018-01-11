export class InterestAmount {

  amount: number

  deserialize (input?: any): InterestAmount {
    if (input) {
      this.amount = input.amount
    }
    return this
  }
}
