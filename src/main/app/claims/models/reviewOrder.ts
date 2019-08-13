import { Moment } from 'moment'
import { ActorType } from 'claims/models/claim-states/actor-type'

export interface ReviewOrder {

  requestedBy?: ActorType
  reason?: String
  requestedAt?: Moment
}

export namespace ReviewOrder {
  export function deserialize (input?: any): ReviewOrder {
    if (!input) {
      return input
    }
    return {
      requestedBy: input.requestdBy,
      reason: input.reason,
      requestedAt: input.requestAt
    }

  }
}
