import { PartyType } from 'app/common/partyType'
import { Party } from 'app/claims/models/details/yours/party'
import { Individual } from 'app/claims/models/details/yours/individual'
import { Company } from 'app/claims/models/details/yours/company'
import { SoleTrader } from 'app/claims/models/details/yours/soleTrader'
import { Organisation } from 'app/claims/models/details/yours/organisation'
import { StatementOfTruth } from 'claims/models/statementOfTruth'

export enum ResponseType {
  FULL_DEFENCE = 'FULL_DEFENCE',
  PART_ADMISSION = 'PART_ADMISSION'
}

export interface ResponseCommon {
  responseType: ResponseType
  freeMediation: string
  moreTimeNeeded?: string
  defendant: Party
  statementOfTruth?: StatementOfTruth
}

export namespace ResponseCommon {
  export function deserialize (input: any): ResponseCommon {
    return {
      responseType: input.responseType,
      freeMediation: input.freeMediation,
      moreTimeNeeded: input.moreTimeNeeded,
      defendant: deserializeDefendantDetails(input.defendant),
      statementOfTruth: input.statementOfTruth
        ? new StatementOfTruth().deserialize(input.statementOfTruth)
        : undefined
    }
  }
}

function deserializeDefendantDetails (defendant: any): Party {
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
}
