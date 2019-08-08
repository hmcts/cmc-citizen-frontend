import { Moment } from 'moment'
import { Address } from 'claims/models/address'
import { YesNoOption } from 'models/yesNoOption'
import { Direction } from 'claims/models/Direction'
import * as HearingCourtType from 'claims/models/hearingCourtType'
import * as HearingDurationType from 'claims/models/hearingDurationType'

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
  estimatedHearingDuration?: string
}

export namespace DirectionOrder {
  export function deserialize (input?: any): DirectionOrder {
    if (!input) {
      return input
    }
    return {
      createdOn : input.createdOn,
      hearingCourtAddress : input.hearingCourtAddress,
      directions : Direction.deserialize(input.directions),
      extraDocUploadList: input.extraDocUploadList,
      paperDetermination: input.paperDetermination,
      newRequestedCourt: input.newRequestedCourt,
      preferredDQCourt: input.preferredDQCourt,
      preferredCourtObjectingReason: input.preferredCourtObjectingReason,
      hearingCourt: HearingCourtType[input.hearingCourt],
      estimatedHearingDuration : HearingDurationType[input.estimatedHearingDuration]
    }

  }
}
