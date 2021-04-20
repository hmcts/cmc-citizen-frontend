import { InterestBreakdown } from 'claims/models/interestBreakdown'
import { InterestDate } from 'claims/models/interestDate'
import { Moment } from 'moment'
import { MomentFactory } from 'shared/momentFactory'

export class Interest {

  constructor (public type?: string, public rate?: number, public reason?: string, public specificDailyAmount?: number,
               public interestBreakdown?: InterestBreakdown, public interestDate?: InterestDate, public lastInterestCalculationDate?: Moment) {}

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
        this.interestBreakdown = new InterestBreakdown().deserialize(input.interestBreakdown)
      }
      if (input.interestDate) {
        this.interestDate = new InterestDate().deserialize(input.interestDate)
      }
      if (input.lastInterestCalculationDate) {
        this.lastInterestCalculationDate = MomentFactory.parse(input.lastInterestCalculationDate)
      }
    }
    return this
  }

}
