
import { Moment } from 'moment'
import { MomentFactory } from 'shared/momentFactory'

export class Offer {
  content: string
  completionDate: Moment

  constructor (content?: string, completionDate?: Moment) {
    this.content = content
    this.completionDate = completionDate
  }

  deserialize (input: any): Offer {
    if (input) {
      this.content = input.content
      this.completionDate = MomentFactory.parse(input.completionDate)
    }
    return this
  }
}
