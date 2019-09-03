import * as moment from 'moment'
import { MomentFactory } from 'shared/momentFactory'

export class ReviewOrder {
  reason: string
  requestedBy: string
  requestedAt: moment.Moment

  constructor (reason?: string, requestedBy?: string, requestedAt?: moment.Moment) {
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

  isReconsiderationDeadlinePassed (deadline: moment.Moment): boolean {
    if (!deadline) {
      return false
    }

    return MomentFactory.currentDateTime().isAfter(deadline.set({ h: 16, m: 0 }))
  }
}
