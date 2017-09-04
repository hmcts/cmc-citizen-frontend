import { Serializable } from 'models/serializable'
import { PartyType } from 'app/forms/models/partyType'
import { Party } from 'app/claims/models/details/yours/party'
import { Individual } from 'app/claims/models/details/yours/individual'
import { Company } from 'app/claims/models/details/yours/company'
import { Organisation } from 'app/claims/models/details/yours/organisation'
import { SoleTrader } from 'app/claims/models/details/yours/soleTrader'
import { Draft } from 'app/models/draft'

export class ResponseData extends Draft implements Serializable<ResponseData> {

  response?: string
  defence?: string
  freeMediation?: string
  moreTimeNeeded?: string
  defendant?: Party

  constructor (response?: string,
              defence?: string,
              freeMediation?: string,
              moreTimeNeeded?: string,
              defendant?: Party) {
    super()
    this.response = response
    this.defence = defence
    this.freeMediation = freeMediation
    this.moreTimeNeeded = moreTimeNeeded
    this.defendant = defendant
  }

  deserialize (input: any): ResponseData {
    if (input) {
      this.response = input.response
      this.defence = input.defence
      this.freeMediation = input.freeMediation.option
      this.moreTimeNeeded = input.moreTimeNeeded.option

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
      this.lastUpdateTimestamp = input.lastUpdateTimestamp
    }
    return this
  }
}
