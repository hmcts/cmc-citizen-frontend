import { Moment } from 'moment'
import { MomentFactory } from 'shared/momentFactory'

export class ReviewOrder {
  reason: string
  requestedBy: string
  requestedAt: Moment

  constructor (reason?: string, requestedBy?: string, requestedAt?: Moment) {
    this.reason = reason
    this.requestedBy = requestedBy
    this.requestedAt = requestedAt
  }

  deserialize (input: any): ReviewOrder {
    if (input) {
      this.reason = input.reason
      this.requestedBy = input.requestedBy
      this.requestedAt = MomentFactory.parse(input.requestedAt)
    }

    return this
  }
}
