import { PartyType } from 'app/common/partyType'
import { Party } from 'app/claims/models/details/yours/party'
import { Individual } from 'app/claims/models/details/yours/individual'
import { Company } from 'app/claims/models/details/yours/company'
import { Organisation } from 'app/claims/models/details/yours/organisation'
import { SoleTrader } from 'app/claims/models/details/yours/soleTrader'
import { StatementOfTruth } from 'claims/models/statementOfTruth'
import { DefenceType } from 'claims/models/defendantResponse'

export class ResponseData {
  responseType: 'FULL_DEFENCE'
  defenceType: DefenceType
  defence?: string
  freeMediation?: string
  moreTimeNeeded?: string
  defendant?: Party
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

  deserialize (input: any): ResponseData {
    if (input) {
      this.responseType = input.responseType
      this.defenceType = input.defenceType
      this.defence = input.defence
      this.freeMediation = input.freeMediation
      this.moreTimeNeeded = input.moreTimeNeeded

      switch (input.defendant.type) {
        case PartyType.INDIVIDUAL.value:
          this.defendant = new Individual().deserialize(input.defendant)
          break
        case PartyType.COMPANY.value:
          this.defendant = new Company().deserialize(input.defendant)
          break
        case PartyType.ORGANISATION.value:
          this.defendant = new Organisation().deserialize(input.defendant)
          break
        case PartyType.SOLE_TRADER_OR_SELF_EMPLOYED.value:
          this.defendant = new SoleTrader().deserialize(input.defendant)
          break
      }
    }
    return this
  }
}
