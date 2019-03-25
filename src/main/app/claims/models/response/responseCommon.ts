import { ResponseType } from 'claims/models/response/responseType'

import { YesNoOption } from 'claims/models/response/core/yesNoOption'

import { PartyType } from 'common/partyType'
import { Party } from 'claims/models/details/yours/party'
import { Individual } from 'claims/models/details/yours/individual'
import { SoleTrader } from 'claims/models/details/yours/soleTrader'
import { Company } from 'claims/models/details/yours/company'
import { Organisation } from 'claims/models/details/yours/organisation'

import { StatementOfTruth } from 'claims/models/statementOfTruth'

export interface ResponseCommon {
  responseType: ResponseType
  defendant: Party
  moreTimeNeeded?: YesNoOption
  freeMediation?: YesNoOption
  mediationPhoneNumber?: string
  mediationContactPerson?: string
  statementOfTruth?: StatementOfTruth
}

export namespace ResponseCommon {
  export function deserialize (input: any): ResponseCommon {
    return {
      responseType: input.responseType,
      defendant: deserializeDefendantDetails(input.defendant),
      freeMediation: input.freeMediation,
      mediationPhoneNumber: input.mediationPhoneNumber,
      mediationContactPerson: input.mediationContactPerson,
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
