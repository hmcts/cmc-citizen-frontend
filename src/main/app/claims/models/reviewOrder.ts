import { Moment } from 'moment'
import { MomentFactory } from 'shared/momentFactory'
import { MadeBy } from 'claims/models/madeBy'

export class ReviewOrder {
  reason: string
  requestedBy: MadeBy
  requestedAt: Moment

  constructor (reason?: string, requestedBy?: MadeBy, requestedAt?: Moment) {
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
