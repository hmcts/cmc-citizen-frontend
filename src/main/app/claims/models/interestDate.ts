import { LocalDate } from 'forms/models/localDate'

export class InterestDate {

  constructor (public type?: string, public date?: LocalDate, public reason?: string, public endDate?: string) {}

  deserialize (input?: any): InterestDate {
    if (input) {
      this.type = input.type
      if (input.date != null) {
        this.date = new LocalDate(input.date)
      }
      if (input.reason) {
        this.reason = input.reason
      }
      if (input.endDate != null) {
        this.endDate = input.endDate
      }
    }
    return this
  }

}
