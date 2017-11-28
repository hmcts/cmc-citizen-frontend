import { PartyType } from 'app/common/partyType'
import { Party } from 'app/claims/models/details/yours/party'
import { Individual } from 'app/claims/models/details/yours/individual'
import { Company } from 'app/claims/models/details/yours/company'
import { Organisation } from 'app/claims/models/details/yours/organisation'
import { SoleTrader } from 'app/claims/models/details/yours/soleTrader'
import { StatementOfTruth } from 'claims/models/statementOfTruth'

export class ResponseData {

  response?: string
  defence?: string
  freeMediation?: string
  moreTimeNeeded?: string
  defendant?: Party
  statementOfTruth?: StatementOfTruth

  constructor (response?: string,
              defence?: string,
              freeMediation?: string,
              moreTimeNeeded?: string,
              defendant?: Party,
              statementOfTruth?: StatementOfTruth) {
    this.response = response
    this.defence = defence
    this.freeMediation = freeMediation
    this.moreTimeNeeded = moreTimeNeeded
    this.defendant = defendant
    this.statementOfTruth = statementOfTruth
  }

  deserialize (input: any): ResponseData {
    if (input) {
      this.response = input.response
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
