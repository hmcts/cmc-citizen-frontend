import { Moment } from 'moment'
import { MomentFactory } from 'shared/momentFactory'

export class InterestDate {

  constructor (public type?: string, public date?: Moment, public reason?: string, public endDateType?: string) {}

  deserialize (input?: any): InterestDate {
    if (input) {
      this.type = input.type
      if (input.date !== undefined) {
        this.date = MomentFactory.parse(input.date)
      }
      if (input.reason) {
        this.reason = input.reason
      }
      if (input.endDateType !== undefined) {
        this.endDateType = input.endDateType
      }
    }
    return this
  }

}
