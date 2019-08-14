import { Moment } from 'moment'
import { ActorType } from 'claims/models/claim-states/actor-type'
import { MomentFactory } from 'shared/momentFactory'

export interface ReviewOrder {

  requestedBy?: ActorType
  reason?: String
  requestedAt?: Moment,
  commentsLastDay?: Moment
}

export namespace ReviewOrder {
  export function deserialize (input?: any): ReviewOrder {
    if (!input) {
      return input
    }
    return {
      requestedBy: input.requestedBy,
      reason: input.reason,
      requestedAt: input.requestedAt,
      commentsLastDay: getCommentsLastDay(input.requestedAt)
    }

  }

  export function getCommentsLastDay (requestedAt) {
    return MomentFactory.parse(requestedAt).add(12, 'days')
  }
}
