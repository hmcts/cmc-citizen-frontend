import { InterestBreakdown } from 'claims/models/InterestBreakdown'

export class Interest {

  constructor (public type?: string, public rate?: number, public reason?: string, public specificDailyAmount?: number,
               public interestBreakdown?: InterestBreakdown) {}

  deserialize (input?: any): Interest {
    if (input) {
      this.type = input.type
      if (input.rate) {
        this.rate = input.rate
      }
      if (input.reason) {
        this.reason = input.reason
      }
      if (input.specificDailyAmount) {
        this.specificDailyAmount = input.specificDailyAmount
      }
      if (input.interestBreakdown) {
        this.interestBreakdown = new InterestBreakdown().deserialize(input.reason)
      }
    }
    return this
  }

}
