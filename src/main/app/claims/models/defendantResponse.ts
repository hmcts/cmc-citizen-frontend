import { Serializable } from 'app/models/serializable'
import { PartyType } from 'app/common/partyType'
import { Individual } from 'app/claims/models/details/theirs/individual'
import { Company } from 'app/claims/models/details/theirs/company'
import { SoleTrader } from 'app/claims/models/details/theirs/soleTrader'
import { Organisation } from 'app/claims/models/details/theirs/organisation'
import { TheirDetails } from 'app/claims/models/details/theirs/theirDetails'
import { StatementOfTruth } from 'claims/models/statementOfTruth'
import { ResponseType } from 'response/form/models/responseType'

export class DefendantResponse implements Serializable<DefendantResponse> {
  type: ResponseType
  defence: string
  freeMediation: string
  defendantDetails: TheirDetails
  statementOfTruth?: StatementOfTruth

  private static deserializeDefendantDetails (defendant: any): TheirDetails {
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

  deserialize (input: any): DefendantResponse {
    if (input) {
      this.type = ResponseType.valueOf(input.response)
      this.defence = input.defence
      this.freeMediation = input.freeMediation
      this.defendantDetails = DefendantResponse.deserializeDefendantDetails(input.defendant)
      if (input.statementOfTruth) {
        this.statementOfTruth = new StatementOfTruth().deserialize(input.statementOfTruth)
      }
    }
    return this
  }

}
