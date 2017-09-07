import { Serializable } from 'models/serializable'

import { Moment } from 'moment'
import { DefendantResponseData } from 'app/claims/models/defendantResponseData'
import { MomentFactory } from 'common/momentFactory'
import { TheirDetails as Defendant } from 'app/claims/models/details/theirs/theirDetails'
import { PartyType } from 'app/common/partyType'
import { Individual } from 'app/claims/models/details/theirs/individual'
import { Company } from 'app/claims/models/details/theirs/company'
import { SoleTrader } from 'app/claims/models/details/theirs/soleTrader'
import { Organisation } from 'app/claims/models/details/theirs/organisation'

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
      this.defendantDetails = this.deserializeDefendantDetails(input.response.defendant)
      this.respondedAt = MomentFactory.parse(input.respondedAt)
      this.defendantId = input.defendantId
      this.defendantEmail = input.defendantEmail
    }
    return this
  }

  private deserializeDefendantDetails (defendant: any): Defendant {
    if (defendant) {
      switch (defendant.type) {
        case PartyType.INDIVIDUAL.value:
          return new Individual().deserialize(defendant)
        case PartyType.COMPANY.value:
          return new Company().deserialize(defendant)
        case PartyType.SOLE_TRADER_OR_SELF_EMPLOYED.value:
          return new SoleTrader().deserialize(defendant)
        case PartyType.ORGANISATION.value:
          return new Organisation().deserialize(defendant)
        default:
          throw Error(`Unknown party type: ${defendant.type}`)
      }
    }
    return undefined
  }
}
