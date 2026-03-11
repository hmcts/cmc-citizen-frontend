import { Moment } from 'moment'

export class Draft<T> {
  id: number
  type: string
  document: T
  created: Moment
  updated: Moment

  constructor (id: number, type: string, document: T, created: Moment, updated: Moment) {
    this.id = id
    this.type = type
    this.document = document
    this.created = created
    this.updated = updated
  }
}
