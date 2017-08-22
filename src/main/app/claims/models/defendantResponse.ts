import { Serializable } from 'models/serializable'

import { Moment } from 'moment'
import { DefendantResponseData } from 'app/claims/models/defendantResponseData'
import { MomentFactory } from 'common/momentFactory'
import { TheirDetails as Defendant } from 'app/claims/models/details/theirs/theirDetails'

export class DefendantResponse implements Serializable<DefendantResponse> {

  id: number
  defendantId: number
  claimId: number
  response: DefendantResponseData
  defendantDetails: Defendant
  respondedAt: Moment
  defendantEmail: string

  deserialize (input: any): DefendantResponse {
    if (input) {
      this.id = input.id
      this.claimId = input.claimId
      this.response = new DefendantResponseData().deserialize(input.response)
      this.defendantDetails = new Defendant().deserialize(input.response.defendant)
      this.respondedAt = MomentFactory.parse(input.respondedAt)
      this.defendantId = input.defendantId
      this.defendantEmail = input.defendantEmail
    }
    return this
  }
}
