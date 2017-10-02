import { Moment } from 'moment'

export interface DraftDocument {}

export class Draft<T extends DraftDocument> {
  id: number
  document: T
  type: string
  created: Moment
  updated: Moment
}
