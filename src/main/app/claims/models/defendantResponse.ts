import { PartyType } from 'app/common/partyType'
import { Party } from 'app/claims/models/details/yours/party'
import { Individual } from 'app/claims/models/details/yours/individual'
import { Company } from 'app/claims/models/details/yours/company'
import { SoleTrader } from 'app/claims/models/details/yours/soleTrader'
import { Organisation } from 'app/claims/models/details/yours/organisation'
import { StatementOfTruth } from 'claims/models/statementOfTruth'

export type DefenceType
  = 'DISPUTE'
  | 'ALREADY_PAID'

export class DefendantResponse {
  responseType: 'FULL_DEFENCE'
  defenceType: DefenceType
  defence: string
  freeMediation: string
  moreTimeNeeded?: string
  defendant: Party
  statementOfTruth?: StatementOfTruth

  constructor (
    defenceType?: DefenceType,
    defence?: string,
    freeMediation?: string,
    moreTimeNeeded?: string,
    defendant?: Party,
    statementOfTruth?: StatementOfTruth
  ) {
    this.responseType = 'FULL_DEFENCE'
    this.defenceType = defenceType
    this.defence = defence
    this.freeMediation = freeMediation
    this.moreTimeNeeded = moreTimeNeeded
    this.defendant = defendant
    this.statementOfTruth = statementOfTruth
  }

  private static deserializeDefendantDetails (defendant: any): Party {
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
      this.responseType = input.responseType
      this.defenceType = input.defenceType
      this.defence = input.defence
      this.freeMediation = input.freeMediation
      this.moreTimeNeeded = input.moreTimeNeeded
      this.defendant = DefendantResponse.deserializeDefendantDetails(input.defendant)
      if (input.statementOfTruth) {
        this.statementOfTruth = new StatementOfTruth().deserialize(input.statementOfTruth)
      }
    }
    return this
  }
}
