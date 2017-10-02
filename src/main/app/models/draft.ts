import { Moment } from 'moment'

export class DraftDocument {
  externalId: string
}

export class Draft<T extends DraftDocument> {
  id: number
  document: T
  type: string
  created: Moment
  updated: Moment
}
