import { Moment } from 'moment'
import { Address } from 'claims/models/address'
import { YesNoOption } from 'models/yesNoOption'
import { Direction } from 'claims/models/Direction'
import { MomentFactory } from 'shared/momentFactory'

export interface DirectionOrder {
  createdOn?: Moment
  hearingCourtAddress?: Address
  directions?: Direction[]
  extraDocUploadList?: string[]
  paperDetermination?: YesNoOption
  newRequestedCourt?: string
  preferredDQCourt?: string
  preferredCourtObjectingReason?: string
  hearingCourt?: string
  estimatedHearingDuration?: string,
  reviewLastDay?: Moment,
  postDocumentsLastDay?: Moment,
  isReviewOrderEligible?: boolean
}

export namespace DirectionOrder {
  export function deserialize (input?: any): DirectionOrder {
    if (!input) {
      return input
    }
    return {
      createdOn: input.createdOn,
      hearingCourtAddress: input.hearingCourtAddress,
      directions: Direction.deserialize(input.directions),
      extraDocUploadList: input.extraDocUploadList,
      paperDetermination: input.paperDetermination,
      newRequestedCourt: input.newRequestedCourt,
      preferredDQCourt: input.preferredDQCourt,
      preferredCourtObjectingReason: input.preferredCourtObjectingReason,
      hearingCourt: input.hearingCourt,
      estimatedHearingDuration: input.estimatedHearingDuration,
      reviewLastDay: getLastDateForReview(input.createdOn),
      postDocumentsLastDay: getPostDocumentsLastDay(input.directions),
      isReviewOrderEligible: findIsReviewOrderEligible(input.createdOn)
    }
  }

  export function getLastDateForReview (createdOn: string): Moment {
    return MomentFactory.parse(createdOn).add(12, 'days')
  }

  export function getPostDocumentsLastDay (directions: Direction[]): Moment {
    const direction = directions
      .filter(o => o.directionType === 'DOCUMENTS')
      .pop()

    return direction.directionActionedBy
  }

  export function findIsReviewOrderEligible (createdOn: string): boolean {
    return MomentFactory.currentDate() < getLastDateForReview(createdOn)
  }
}
