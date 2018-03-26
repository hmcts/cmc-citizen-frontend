export class InterestBreakdown {

  constructor (public totalAmount?: number, public explanation?: string) {}

  deserialize (input?: any): InterestBreakdown {
    if (input) {
      this.totalAmount = input.totalAmount
      this.explanation = input.explanation
    }
    return this
  }

}
