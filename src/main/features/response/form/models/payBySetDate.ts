import { Serializable } from 'models/serializable'
import { LocalDate } from 'forms/models/localDate'

export class PayBySetDate implements Serializable<PayBySetDate> {
  date: LocalDate
  explanation?: string

  constructor (date?: LocalDate, explanation?: string) {
    this.date = date
    this.explanation = explanation
  }

  static fromObject (value?: any): PayBySetDate {
    if (!value) {
      return undefined
    }
    return new PayBySetDate(
      LocalDate.fromObject(value.date),
      value.explanation
    )
  }

  deserialize (input: any): PayBySetDate {
    if (input) {
      this.date = new LocalDate().deserialize(input.date)
      this.explanation = input.explanation
    }
    return this
  }
}
