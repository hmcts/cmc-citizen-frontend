import { Serializable } from 'models/serializable'
import { LocalDate } from 'forms/models/localDate'

export class PaymentDate implements Serializable<PaymentDate> {
  date: LocalDate

  constructor (date?: LocalDate) {
    this.date = date
  }

  static fromObject (input?: any): PaymentDate {
    if (!input) {
      return undefined
    }
    return new PaymentDate(
      LocalDate.fromObject(input.date)
    )
  }

  deserialize (input: any): PaymentDate {
    if (input) {
      this.date = new LocalDate().deserialize(input.date)
    }
    return this
  }
}
