
import { Serializable } from 'models/serializable'

export class Offer implements Serializable<Offer> {
  content?: string
  completionDate?: string

  constructor (content?: string, completionDate?: string) {
    this.content = content
    this.completionDate = completionDate
  }

  deserialize (input: any): Offer {
    if (input) {
      this.content = input.content
      this.completionDate = input.completionDate
    }
    return this
  }
}
