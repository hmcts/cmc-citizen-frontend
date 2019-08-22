import * as moment from 'moment'
import { Address } from 'claims/models/address'
import { YesNoOption } from 'models/yesNoOption'
import { Direction } from 'claims/models/Direction'
import { MomentFactory } from 'shared/momentFactory'

export interface DirectionOrder {
  createdOn?: moment.Moment
  hearingCourtAddress?: Address
  directions?: Direction[]
  extraDocUploadList?: string[]
  paperDetermination?: YesNoOption
  newRequestedCourt?: string
  preferredDQCourt?: string
  preferredCourtObjectingReason?: string
  hearingCourt?: string
  estimatedHearingDuration?: string,
  postDocumentsLastDay?: moment.Moment
}

export namespace DirectionOrder {
  export function deserialize (input?: any): DirectionOrder {
    if (!input) {
      return input
    }
    return {
      createdOn: MomentFactory.parse(input.createdOn),
      hearingCourtAddress: input.hearingCourtAddress,
      directions: Direction.deserialize(input.directions),
      extraDocUploadList: input.extraDocUploadList,
      paperDetermination: input.paperDetermination,
      newRequestedCourt: input.newRequestedCourt,
      preferredDQCourt: input.preferredDQCourt,
      preferredCourtObjectingReason: input.preferredCourtObjectingReason,
      hearingCourt: input.hearingCourt,
      estimatedHearingDuration: input.estimatedHearingDuration,
      postDocumentsLastDay: getPostDocumentsLastDay(input.directions)
    }
  }

  export function getPostDocumentsLastDay (directions: Direction[]): moment.Moment {
    const directionActionedDates: moment.Moment[] = directions.map(direction => moment(direction.directionActionedDate))
    return moment.max(directionActionedDates)
  }

  export function isReviewOrderEligible (deadline: moment.Moment): boolean {
    if (!deadline) {
      return false
    }

    return MomentFactory.currentDateTime().isAfter(deadline.set({ h: 16, m: 0 }))
  }
}
