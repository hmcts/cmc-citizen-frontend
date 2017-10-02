import { Moment } from 'moment'

export interface Draft {}

export class DraftWrapper<T extends Draft> {
  id: number
  document: T
  type: string
  created: Moment
  updated: Moment
}
