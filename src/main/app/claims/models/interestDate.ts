import { Serializable } from 'models/serializable'
import { Moment } from 'moment'
import { MomentFactory } from 'common/momentFactory'

export default class InterestDate implements Serializable<InterestDate> {

  type: string
  date?: Moment
  reason?: string

  deserialize (input?: any): InterestDate {
    if (input) {
      this.type = input.type
      if (input.date != null) {
        this.date = MomentFactory.parse(input.date)
      }
      this.reason = input.reason
    }
    return this
  }

}
