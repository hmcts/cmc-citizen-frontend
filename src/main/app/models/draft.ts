import { Moment } from 'moment'

export class Draft {
  lastUpdateTimestamp: number
}

export class DraftWrapper<T extends Draft> {
  id: number
  document: T
  type: string
  created: Moment
  updated: Moment
}
